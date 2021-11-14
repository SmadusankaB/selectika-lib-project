import { Component, ViewChild, ElementRef, AfterViewInit, Input, Output, EventEmitter } from '@angular/core';
import { fromEvent } from 'rxjs';
import { pairwise, switchMap, takeUntil } from 'rxjs/operators';
import { CGeneralUtils } from '../../slk-lib/gam/C_AbsGeneral';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss']
})
export class CanvasComponent implements AfterViewInit {
  @Input() path = '';
  @Input() color = '';
  // tslint:disable-next-line: no-output-rename
  @Output('update') newVal = new EventEmitter<number[]>();

  canvasWidth = 300;
  canvasHeight = 450;
    /** Template reference to the canvas element */
  @ViewChild('canvasEl') canvasEl!: ElementRef;

  /** Canvas 2d context */
  private context!: CanvasRenderingContext2D | null;

  utils = new CGeneralUtils();

  mRgb: number[] = [];
  mHexColor = '';
  downloadedImg: HTMLImageElement;

  constructor() { }

  ngAfterViewInit() {
    const res = (this.canvasEl.nativeElement as HTMLCanvasElement).getContext('2d');
    if (!res || !(res instanceof CanvasRenderingContext2D)) {
      throw new Error('Failed to get 2D context');
    }
    this.context = res;

    this.mRgb = this.utils.colorStrToRGB(this.color);
    this.mHexColor = this.utils.rgbToHex(this.mRgb[0], this.mRgb[1], this.mRgb[2]);
    this.startDownload();
  }

startDownload() {
  const that = this;
  if (that.context?.canvas === null) {
    return;
  }

  this.downloadedImg = new Image();
  this.downloadedImg.crossOrigin = 'Anonymous';
  this.downloadedImg.addEventListener('load', this.imageReceived, false);
  this.downloadedImg.src = this.path;
  this.downloadedImg.onload = () => {
    if (that.context !== null) {
      // const imageData = that.context.getImageData(0, 0, img.width, img.height);
      // console.log(imageData);
      that.context.drawImage(this.downloadedImg, 0, 0, this.downloadedImg.width,
        this.downloadedImg.height, 0, 0, that.canvasWidth, that.canvasHeight);
      that.drawColorPatch(that.mHexColor);
      return true;
    }
  };
}

  imageReceived() {
    const that = this;
    if (that.context?.canvas === null) {
      return;
    }

    const canvas = that.context?.canvas;
    if ( canvas === undefined ) {
      return;
    }
    canvas.width = this.downloadedImg.width;
    canvas.height = this.downloadedImg.height;

    if (that.context === null ) {
      return;
    }
    that.context.drawImage(this.downloadedImg, 0, 0);
    document.body.appendChild(canvas);

    try {
      localStorage.setItem('saved-image-example', canvas.toDataURL('image/png'));
    } catch (err) {
      console.log('Error: ' + err);
    }
  }

  drawColorPatch( hexColor: string ) {
    const that = this;
    if (that.context === null) {
      return;
    }
    that.context.fillStyle = hexColor;
    that.context.fillRect(0, 0, 50, 50);

    that.context.strokeStyle = hexColor;
    that.context.lineWidth = 5;
    that.context.strokeRect(0, 0, that.canvasWidth, that.canvasHeight);
  }

  onMyClick(event: any) {
    const that = this;
    if (that.context === null) {
      return;
    }
    // console.log('offset: ', event.offsetX, event.offsetY);

    const imageData = that.context.getImageData(event.offsetX - 5, event.offsetY - 5, 10, 10);

    const sum = [0, 0, 0];
    const len = imageData.width * imageData.height;

    for ( let i = 0 ; i < len; i++ ) {
      const off = i * 4;
      sum[0] += imageData.data[off];
      sum[1] += imageData.data[off + 1];
      sum[2] += imageData.data[off + 2];
    }

    for ( let i = 0 ; i < 3 ; i++ ) {
      sum[i] = Math.round(sum[i] / len);
    }

    console.log( sum );
    const tmp = this.utils.rgbToHex(sum[0], sum[1], sum[2]);
    that.drawColorPatch(tmp);

    this.newVal.emit(sum);
  }

  private captureEvents(canvasEl: HTMLCanvasElement) {
    // this will capture all mousedown events from the canvas element
    fromEvent(canvasEl, 'mousedown')
      .pipe(
        switchMap((e) => {
          // after a mouse down, we'll record all mouse moves
          return fromEvent(canvasEl, 'mousemove')
            .pipe(
              // we'll stop (and unsubscribe) once the user releases the mouse
              // this will trigger a 'mouseup' event
              takeUntil(fromEvent(canvasEl, 'mouseup')),
              // we'll also stop (and unsubscribe) once the mouse leaves the canvas (mouseleave event)
              takeUntil(fromEvent(canvasEl, 'mouseleave')),
              // pairwise lets us get the previous value to draw a line from
              // the previous point to the current point
              pairwise()
            );
        })
      )
      // .subscribe((res: [MouseEvent, MouseEvent]) => {
      .subscribe(( res ) => {
        const rect = canvasEl.getBoundingClientRect();
        const p0 = res[0] as unknown as MouseEvent;
        const p1 = res[1] as unknown as MouseEvent;
        // previous and current position with the offset
        const prevPos = {
          x: p0.clientX - rect.left,
          y: p0.clientY - rect.top
        };

        const currentPos = {
          x: p1.clientX - rect.left,
          y: p1.clientY - rect.top
        };

        // this method we'll implement soon to do the actual drawing
        this.drawOnCanvas(prevPos, currentPos);
      });
  }

  private drawOnCanvas(prevPos: { x: number, y: number }, currentPos: { x: number, y: number }) {
    if (!this.context) { return; }

    this.context.beginPath();

    if (prevPos) {
      this.context.moveTo(prevPos.x, prevPos.y); // from
      this.context.lineTo(currentPos.x, currentPos.y);
      this.context.stroke();
    }
  }

  // Visit rgb pixel data in various blocks; if any rgb values are not equal, the assumption is a color image.
  private isGrayScaleImage(imageData: any): boolean {
    const data = imageData.data;
    const max = 1000;

    const isGray = this.isPixelDataGrayScale(data, 0, data.length);
    if (isGray) {
      return true;
    } else {
      return false;
    }
  }

  private isPixelDataGrayScale(data: number[], min: number, max: number): boolean {
    for (let j = min; j < min + max; j += 4) {
      const r = data[j];
      const g = data[j + 1];
      const b = data[j + 2];
      if (r !== g && r !== b) {
        console.log(`Found rgb color pixels ${r}/${g}/${b} at data[${j}]`);
        return false;
      }
    }
    return true;
  }

  /**
   * Draws something using the context we obtained earlier on
   */
  private draw() {
    if (this.context !== null) {
      this.context.font = '30px Arial';
      this.context.textBaseline = 'middle';
      this.context.textAlign = 'center';

      const x = (this.canvasEl.nativeElement as HTMLCanvasElement).width / 2;
      const y = (this.canvasEl.nativeElement as HTMLCanvasElement).height / 2;
      this.context.fillText('hello', x, y);

    }
  }

}

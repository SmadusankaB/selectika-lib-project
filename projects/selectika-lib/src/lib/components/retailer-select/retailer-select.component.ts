import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { AppConfigService } from '../../common/app.configService';
import { CAbsFeature } from '../../slk-lib/gam/C_AbsFeature';
import { C_AppSelect } from '../../slk-lib/gam/C_AppSelect';
import { Observable, Subscription } from 'rxjs';


@Component({
  selector: 'app-retailer-select',
  templateUrl: './retailer-select.component.html',
  styleUrls: ['./retailer-select.component.scss']
})
export class RetailerSelectComponent implements OnInit {
  @Input() events!: Observable<void>;

  @Input() forIp = [false, false, false];
  @Input() addInfo = [false, false];

  // tslint:disable-next-line: no-output-rename
  @Output('update') retailerUpdated: EventEmitter<any> = new EventEmitter<any>();

  mGuiNames = ['retailers', 'userTypes', 'category', 'feature', 'tag'];
  inputConfig = [true, true, false, false, false];
  outputVals = ['', '', '', ''];
  mDisplayReady = false;
  mSelectors: C_AppSelect[] = [];

  private eventsSubscription: Subscription | undefined;

  constructor(private config: AppConfigService) {
  }

  setUp() {
    this.mDisplayReady = false;
    if (this.forIp) {
      this.forIp.forEach((val, i) => {
        this.inputConfig[i + 2] = val;
      });
    }

    this.mSelectors = [];
    this.inputConfig.forEach((v, i) => {
      if (v) {
        const gen = this.config.getSelection(i);
        this.mSelectors.push(gen);
      }

    });
    this.mDisplayReady = true;
  }

  ngOnInit() {
    this.eventsSubscription = this.events.subscribe(() => this.setUp());
    this.setUp();
  }


  inUse( i: number ): boolean {
    return this.inputConfig[i];
  }

  needToDisplay(i: number): boolean {
    return (i < this.inputConfig.length);
  }

  allValsFilled(): boolean {
    let vals = 0;

    for (let i = 0; i < this.inputConfig.length; i++) {
      const select = this.config.getCurrentSelection(i);
      if (select.mVal.length > 0) {
        vals++;
      }
    }
    return (vals === this.inputConfig.length);
  }

  onUpdate(event: CAbsFeature, i: number) {
    this.mSelectors[i].show = false;
    this.mSelectors[i].onUpdate( event);

    this.config.update(this.mSelectors[i].values.vals[0], i);
    // before we send - lets check that all are valid.
    if (this.allValsFilled()) {
      const status = this.config.getCurrentSelectionStatus();
      this.retailerUpdated.emit(status);
    }
    this.ngOnInit();
  }
}

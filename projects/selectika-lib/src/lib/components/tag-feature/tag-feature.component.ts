import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AppConfigService } from '../../common/app.configService';
import { CAbsFeature } from '../../slk-lib/gam/C_AbsFeature'

@Component({
  selector: 'app-tag-feature',
  templateUrl: './tag-feature.component.html',
  styleUrls: ['./tag-feature.component.scss']
})
export class TagFeatureComponent implements OnInit {
  @Input() inFeature!: CAbsFeature;
  @Input() inOptions!: CAbsFeature;
  @Input() withColor = false;
  // tslint:disable-next-line: no-output-rename
  @Output('update') newVal: EventEmitter<CAbsFeature> = new EventEmitter<CAbsFeature>();

  showFeature = false;
  mColor = '';

  constructor(private config: AppConfigService) {
  }

  ngOnInit(): void {
    // this.setColor();
    this.showFeature = true;
    // console.assert(this.inFeature !== undefined);
    // console.assert(this.inOptions !== undefined);
  }

  isFeatureMultipleSelect(): boolean {
    if ( this.inOptions === undefined ) {
      return false;
    }

    console.assert(this.inFeature !== null, 'In Feature not valid');
    const rc = this.inOptions.getNumOptions();
    if (rc > 1) {
      return true;
    } else {
      return false;
    }
  }


  getValueForTag(tag: string, value: boolean): string {
    return this.inFeature.getStrForOptions(tag, value);
  }

  isDisabled(i: number) {
    return this.inFeature.isDisabled(i);
  }

  onFeatureChange() {
    this.inFeature.oneSet(this.inFeature.vals, false, this.inOptions );
    this.newVal.emit(this.inFeature);
  }

  setColor(): string {
    if ( this.withColor ) {
      let rv = 'red';
      if (this.inOptions.info.count < 0) {
        rv = 'green';
      }
      return rv;
    }
    return '';
  }
}

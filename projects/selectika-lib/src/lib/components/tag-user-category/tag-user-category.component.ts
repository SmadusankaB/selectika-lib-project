import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CAbsFeature } from '../../slk-lib/gam/C_AbsFeature';
import { C_User } from '../../slk-lib/gam/C_User';

@Component({
  selector: 'app-tag-user-category',
  templateUrl: './tag-user-category.component.html',
  styleUrls: ['./tag-user-category.component.css']
})

export class TagUserCategoryComponent implements OnInit {
  @Input() inUser!: C_User;

  // tslint:disable-next-line: no-output-rename
  @Output('update') newVal: EventEmitter<boolean> = new EventEmitter<boolean>();

  mShowOK = false;
  mCols = 1;
  navigationSubscription: any;
  bChanged = false;
  inCategory = 'User';
  constructor() {
  }


  ngOnInit(): void {
    if (this.inUser !== undefined) {
      this.mShowOK = this.inUser.isReady();
    }

    this.mCols = 2;
    this.bChanged = false;
  }

  isDisplayable(ind: number): boolean {
    return this.inUser.mFeatures[ind].options.info.isDisplayable();
  }

  displayOnly(j: number): string {
    let str = '==> ' + this.inUser.mFeatures[j].values.name;

    this.inUser.mFeatures[j].values.vals.forEach(val => {
      str += ' ' + val;
    });

    str += ' <==';
    return str;
  }

  onUpdateFeature(modified: CAbsFeature) {
    console.assert(modified !== null, 'looking for a real updated feature');
    this.mShowOK = this.inUser.isReady();
  }

  onClickOK() {
    console.log('OK');
    this.newVal.emit(true);
  }

}

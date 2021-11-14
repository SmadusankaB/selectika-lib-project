import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CAbsCategory, CAbsItem } from '../../slk-lib/gam/C_AbsCategory';
import { CAbsFeature } from '../../slk-lib/gam/C_AbsFeature';
import { eQueryState } from '../../slk-lib/gam/Enums';
import { C_User } from '../../slk-lib/gam/C_User';


export interface IEmit {
  category: CAbsCategory;
  completed: boolean;
}

@Component({
  selector: 'app-tag-item-category',
  templateUrl: './tag-item-category.component.html',
  styleUrls: ['./tag-item-category.component.css']
})
export class TagItemCategoryComponent implements OnInit {
  @Input() inCategory: CAbsItem = new CAbsItem('val', []);
  @Input() inOptions: CAbsItem = new CAbsItem('opt', []);

  // tslint:disable-next-line: no-output-rename
  @Output('update') newVal = new EventEmitter<IEmit>();

  mShowOK = false;
  mCols = 1;
  navigationSubscription: any;
  theUser!: C_User;
  mShowButtons = false;

  constructor() {
  }

  ngOnInit(): void {
    console.assert(this.inCategory !== undefined);
    this.setShow();
    console.assert(this.inOptions !== undefined);
    this.mCols = 2;

    console.assert( this.inCategory.vals.length === this.inOptions.vals.length, 'Must be the same' );

    const catState = this.inCategory.getCategoryState();
    if ( catState !== eQueryState.eFalse ) {
      this.mShowButtons = true;
      if ( catState === eQueryState.ePartial ) {
        this.mShowOK = false;
      } else {
        this.mShowOK = true;
      }
    }
  }

  onUpdateFeature(modified: CAbsFeature) {
    this.mShowButtons = false;
    console.assert(modified !== null, 'looking for a real updated feature');
    if (this.inCategory !== undefined) {
      const featureVals = this.inCategory.getFeature(modified.name);
      const opts = this.inOptions.getFeature(modified.name);
      if ( featureVals !== undefined  && opts !== undefined) {
        featureVals.oneSet(modified.vals, false, opts);
      }
      this.setShow();
    }
    this.mShowButtons = true;
  }

  onClickOK() {
    console.log('OK, Category emit to caller');
    const em = { category: this.inCategory, completed: true } as IEmit;
    this.newVal.emit(em);
  }

  onClickPartial() {
    const em = { category: this.inCategory, completed: false } as IEmit;
    this.newVal.emit(em);
  }

  setShow(): void {
    const catState = this.inCategory.getCategoryState();
    this.mShowOK =  catState === eQueryState.eTrue ? true : false;
  }

  somethingChanged(index: number) {
    if (this.inCategory !== undefined) {
      this.setShow();
    }
  }

  isEditable(ind: number): boolean {
    return this.inCategory.vals[ind].isEditable();
  }

  showFeature(ind: number): string {

    let str = '==> ' + this.inCategory.vals[ind].name + ': ';
    this.inCategory.vals[ind].vals.forEach( val => {
      str += ' ' + val;
    });

    str += ' <==';
    return str;
  }
}

import { Injectable } from '@angular/core';
import { AskService } from './ask.service';
import { CookieService } from 'ngx-cookie-service';
import { C_Cookies } from './C_Cookies';

import { CFeatureInfo } from '../slk-lib/gam/C_FeatureInfo';
import { CLoadItemsParams } from '../slk-lib/gam/C_AbsGeneral';
import { I_UTR, C_ReUtCaFeTa } from '../slk-lib/gam/C_ReUtCaFeTa';
import { C_User } from '../slk-lib/gam/C_User';
import { C_UtCatalogs } from '../slk-lib/gam/C_UserTypeConfig';
import { C_RetailerData } from '../slk-lib/gam/C_RetailerData';
import { CAbsCategory, CAbsItem, I_ItemCategory } from '../slk-lib/gam/C_AbsCategory';
import { CAbsFeature } from '../slk-lib/gam/C_AbsFeature';
import { C_Select, C_Selector, eConfigGui } from '../slk-lib/gam/C_Selector';
import { eFeatureType, eGlobalConst, eRequestedBy, eResultType } from '../slk-lib/gam/Enums';
import { C_AppSelect } from '../slk-lib/gam/C_AppSelect';
import { C_InitRequest } from '../slk-lib/gam/C_ServerCmd';

@Injectable({
  providedIn: 'root'
})

@Injectable()
export class AppConfigService {

  private mUtCatalogs!: C_UtCatalogs;
  private mRetailerList: C_RetailerData[] = [];  // when this list will become too long - well we made it
  private mCurSelection = new C_Selector();
  mCS: C_Cookies;
  private mAlgNames: string[][] = [];
  mTableLoad: CLoadItemsParams;

  constructor(
    private cookieService: CookieService,
    private askService: AskService) {
      this.mCS = new C_Cookies(cookieService);
      this.mTableLoad = this.mCS.getLoadParams();
  }

  async initConfigApp(): Promise<void> {
    const defaults = this.mCS.getAppParams();

    if (this.ready()) {
      return;
    }
    const req = new C_InitRequest(eResultType.eSelectikaPersonalShopper, eRequestedBy.eApplication,
      defaults.retailer, defaults.userType);

    await this.getServerData(req)
      .then(() => {
        this.mCurSelection.setBasic(this.mRetailerList, this.mUtCatalogs);
        this.mCurSelection.buildSelect(eConfigGui.eRetailer, req.retailer);
        this.mCurSelection.buildSelect(eConfigGui.eUserType, req.ut);

        const categoryList = this.getCategoryList(req.ut);
        if (defaults.category.length === 0) {
          defaults.category = categoryList[0];
        }
        this.mCurSelection.buildSelect(eConfigGui.eCategory, defaults.category, true);

        const featureList = this.mCurSelection.getFeatureList(defaults.category, req.ut);
        if (defaults.feature.length === 0) {
          defaults.feature = featureList[0];
        }
        this.mCurSelection.buildSelect(eConfigGui.eFeature, defaults.feature, true);
        this.mCurSelection.buildSelect(eConfigGui.eTag, defaults.tag, true);

        console.log('AppConfigApp is ready ');
      });
  }

  getSelection(i: number): C_AppSelect {
    const ff = this.mCurSelection.getFullFeature(i);
    return ff;
  }

  getCurrentSelection(i: number): C_Select {
    const rv = this.mCurSelection.mSelectors[i];
    return rv;
  }

  getCurrentSelectionStatus(): C_ReUtCaFeTa {
    const rv = this.mCurSelection.status();
    return rv;
  }

  async getServerData(req: C_InitRequest): Promise<void> {
    // console.log('Send server for retailer list...');
    await this.askService.initServerForApp(req)
      .then((data: any[]) => {
        const list = data[0];
        for (const retailer of list) {
          const inf = new C_RetailerData(retailer);
          // inf.gui.cdnBaseUrl = this.mCdnBase; - wc
          this.mRetailerList.push(inf);
        }
        this.mUtCatalogs = new C_UtCatalogs(data[1]);
        this.mAlgNames = data[2];
      },
        err => {
          console.log('Failed to get retailer lis', err);
        });
  }

  ready(): boolean {
    return (this.mUtCatalogs !== undefined &&
      this.mRetailerList.length > 0);
  }

  valid(): void {
    console.assert(this.ready());
  }


  getRetailerIndex(name: string): number {
    for (let i = 0; i < this.mRetailerList.length; i++) {
      if (name === this.mRetailerList[i].retailerName) {
        return i;
      }
    }
    console.assert(false);
    return -1;
  }

  getRetailer(name: string): C_RetailerData {
    const rIndex = this.getRetailerIndex(name);
    return this.mRetailerList[rIndex];
  }

  createAnewUser(utr: I_UTR): C_User {
    const aRetailer = this.getRetailer(utr.retailer);
    const aUser = new C_User(aRetailer);
    const algsLen = this.getAlgNames(utr.userType).vals.length;
    aUser.initForApp(this.mUtCatalogs, utr.userType, algsLen);
    this.mCurSelection.buildSelect(eConfigGui.eUserType, utr.userType);
    const savedUserInCookies = this.mCS.getUserFromCookies(utr.userType);
    if (savedUserInCookies !== undefined) {
      aUser.updateByCategory(savedUserInCookies);
    }
    return aUser;
  }

  saveCookies(): void {
    const cs = new C_Cookies(this.cookieService);
    cs.saveAppParams(this.mCurSelection.status());
  }

  getCategoryList(ut: string): string[] {
    const rv = this.mUtCatalogs.getCategoryList(ut);
    return rv;
  }

  getUti(userType: string): number {
    return this.mUtCatalogs.ut2i(userType);
  }

  getAlgNames(ut: string): CAbsFeature {
    const ind = this.getUti(ut);

    const info = new CFeatureInfo(eFeatureType.eMultipleSelect);
    const rv = new CAbsFeature('ut_algs', info);

    if (this.mAlgNames !== undefined && this.mAlgNames.length > 0) {
      info.count = this.mAlgNames[ind].length;  // all and selected
      this.mAlgNames[ind].forEach(algName => {
        rv.vals.push(algName);
      });
    }
    return rv;
  }

  /**
   * These next routines help track the current status of the config
   * We maintain a hierarchy of Retailer / UserType / Category / Feature
   *
   * The main updater is retailer select component which give a GUI select for
   * this hierarchy
   */

  update(val: string, i: number): C_Selector {
    for (let ind = i; ind < this.mCurSelection.mSelectors.length; ind++) {
      if (ind === eConfigGui.eRetailer) {
        this.mCurSelection.buildSelect(eConfigGui.eRetailer, val);
      } else {
        let updateWith = val;
        if (ind > i) {
          updateWith = ''; // make sure its checked and resets
        }
        this.mCurSelection.buildSelect(ind, updateWith);
      }
    }
    this.mCS.saveAppParams(this.mCurSelection.status());
    return this.mCurSelection;
  }


  getStatus(): C_ReUtCaFeTa {
    return this.mCurSelection.status();
  }


  /**
   * Random testing
   *  Set of routines to create a random set for testing the server
   */

  // tslint:disable-next-line: typedef
  randomRange(max: number) {
    return Math.floor((Math.random() * max));
  }

  getRandomUT(): string {
    const uts = this.mUtCatalogs.getUserTypes();
    const idx = this.randomRange(uts.length);
    return uts[idx];
  }

  getRandomUTR(): I_UTR {
    const idx = this.randomRange(this.mRetailerList.length);
    const retailer = this.mRetailerList[idx];
    const retailerName = retailer.retailerName;
    let ut = retailer.userTypes[0];
    if (retailer.userTypes.length > 1) {
      const i = this.randomRange(retailer.userTypes.length);
      ut = retailer.userTypes[i];
    }
    return { retailer: retailerName, userType: ut };
  }

  getRandomUser(utr: I_UTR): C_User {
    const i = this.mUtCatalogs.ut2i(utr.userType);
    const ut = this.mUtCatalogs.getUt(i);
    const options = this.mUtCatalogs.getCategory(ut, eGlobalConst.eUser);
    if (options === undefined) {
      console.assert(false);
    }

    const aRetailer = this.getRetailer(utr.retailer);
    const len = this.getAlgNames(ut).vals.length;
    const randUser = new C_User(aRetailer);
    randUser.initForApp(this.mUtCatalogs, utr.userType, len);
    let actualValues: any;

    actualValues = options.generateRandomCategory();
    randUser.setRandomVals(actualValues);
    console.assert(randUser.isReady());

    // use just subset of the algs
    const disableNum = this.randomRange(len);
    for (let j = 0; j < disableNum; j++) {
      const disableIndex = this.randomRange(len);
      randUser.mAlgs[disableIndex] = false;
    }
    return randUser;
  }


  /**
   * service routine for image processing
   */

  getItemCategory(cur: C_ReUtCaFeTa): CAbsCategory {
    return this.mUtCatalogs.getCategory(cur.userType, cur.category);
  }

  /*
  * service routine for item view - editing the category
  *  Used on User
  */

  getOptionWorkPair(categoryName: string, ut: string): I_ItemCategory {
    const category = this.mUtCatalogs.getOptionWorkPair(ut, categoryName);
    return category;
  }


  getWorkFeature(categoryName: string, ut: string): CAbsCategory {
    const category = this.mUtCatalogs.getWorkFeature(ut, categoryName);
    return category;
  }

  // and better
  buildItem(itemCat: CAbsItem, ut: string): I_ItemCategory {
    const item = this.mUtCatalogs.buildItem(itemCat, ut);
    return item;
  }

  updateTableParams( by: CLoadItemsParams): void {
    this.mTableLoad = by;
    this.mCS.saveLoadParams(by);
  }

  getTableParams(): CLoadItemsParams {
    return this.mTableLoad;
  }

}

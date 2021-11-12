import { CookieService } from 'ngx-cookie-service';
import { C_ReUtCaFeTa } from '../../../../../lib/gam/C_ReUtCaFeTa';
import { CAbsUser } from '../../../..//../lib/gam/C_AbsCategory';
import { CAbsFeature } from '../../../../../lib/gam/C_AbsFeature';
import { CFeatureInfo } from '../../../../../lib/gam/C_FeatureInfo';
import { v4 as uuidv4 } from 'uuid';
import { CLoadItemsParams } from '../../../../../lib/gam/C_AbsGeneral';
import { eQueryState } from '../../../../../lib/gam/Enums';


// tslint:disable-next-line: class-name
export class C_Cookies {
  mAppParamsCookieName = 'appParams';
  mIdCookieName = 'askLilyUserId';
  mGoogleGa = '_ga';
  mLoadParamsName = 'loadParams';
  mCs: any;
  constructor(cookieService: CookieService) {
    this.mCs = cookieService;
  }

  check(name: string): boolean {
    return this.mCs.check(name);
  }

  getUniqueId(): string {

    // first choice
    if (this.check(this.mGoogleGa)) {
      const cookie = this.mCs.get(this.mGoogleGa);
      return cookie as string;
    }

    // second choice
    if ( this.check(this.mIdCookieName)) {
      const cookie = this.mCs.get(this.mIdCookieName);
      return cookie as string;
    }

    // if all fails
    const id = uuidv4();
    this.mCs.set(this.mIdCookieName, id, 10);  // 10 days
    return id as string;
  }

  getUserFromCookies(name: string): CAbsUser | undefined {
    if (this.check(name)) {
      const cookie = this.mCs.get(name);
      const vals = JSON.parse(cookie);

      const features: CAbsFeature[] = [];
      vals.forEach((feat: any) => {
        const feature = new CAbsFeature(feat.name, new CFeatureInfo(feat.type));
        feature.load(feat);
        features.push(feature);
      });
      const user = new CAbsUser(features);
      return user;
    }
    return undefined;
  }

  saveUser(userToSave: CAbsFeature[], underName: string): void {
    const tmp = JSON.stringify(userToSave);
    this.mCs.set(underName, tmp, 10);  // 10 days
  }

  saveAppParams( all: C_ReUtCaFeTa): void {
    // I know its not used yet...
    const tmp = JSON.stringify(all);
    this.mCs.set(this.mAppParamsCookieName, tmp, 10);  // 10 days
  }

  saveLoadParams(loadParams: CLoadItemsParams): void {
    // I know its not used yet...
    const tmp = JSON.stringify(loadParams);
    this.mCs.set(this.mLoadParamsName, tmp, 10);  // 10 days
  }

  getLoadParams(): CLoadItemsParams {
    const rv  = new CLoadItemsParams();  // the original default
    if (this.check(this.mLoadParamsName)) {
      const cookie = this.mCs.get(this.mLoadParamsName);
      const savedParams = JSON.parse(cookie);
      if (savedParams) {
        rv.load( savedParams );
      }
    }

    return rv;
  }

  getAppParams(): C_ReUtCaFeTa {
    // for any who ask - she was my first retailer first ut
    const rv = new C_ReUtCaFeTa();
    rv.retailer = 'rinazin';
    rv.userType = 'female';
    // rv.category = 'Pants';
    // rv.feature = 'PantsFit';
    // rv.tag = 'Skinny pants fit';

    if (this.check(this.mAppParamsCookieName)) {
      const cookie = this.mCs.get(this.mAppParamsCookieName);
      const savedParams = JSON.parse(cookie);
      if (savedParams) {
        rv.load(savedParams);
      }
    }
    return rv;

  }

  deleteUser(name: string): void {
    if (!this.check(name)) { return; }
    this.mCs.delete(name);
  }
}

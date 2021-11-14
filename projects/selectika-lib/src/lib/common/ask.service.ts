import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { C_AppResults, C_NetResults, C_WcResults } from '../slk-lib/gam/C_ResultDef';
import { C_DbItem } from '../slk-lib/gam/C_DbItem';
import { eLearn, eResultType } from '../slk-lib/gam/Enums';
import { C_AskCmd, C_InitRequest } from '../slk-lib/gam/C_ServerCmd';

/*
  NOTICE - this file is duplicated in ASK_WC!! and ASK_BACK OFFICE (know as client)
  Make sure to keep them the same....
*/

@Injectable({
  providedIn: 'root'
})
export class AskService {

  numItemsSelected = 0;
  ipAddress = 'http://10.182.0.233:8585/';
  ipTestUrl = 'https://hookb.in/G9XrbrqpKGuE2xPP2kQB';
  mInitServerUrl = '';
  mAskServerUrl = '';
  baseUrl = '';

  constructor(private http: HttpClient) {
  }

  setBaseUrl(baseUrl: string): void {
    this.baseUrl = baseUrl;
    this.mInitServerUrl = this.baseUrl + '/initServer';
    this.mAskServerUrl = this.baseUrl + '/askServer';
  }

  async initServerForWc(cmd: C_InitRequest): Promise<string[]> {
    console.assert(cmd.action > eResultType.eError);
    const rv: string[] = [];
    const params: any[] = [];
    params.push(JSON.stringify(cmd));
    let bList = false;

    this.http.post<any>(this.mInitServerUrl, params)
      .subscribe(list => {
        list.forEach((val: string) => {
          rv.push(val);
        });
        bList = true;
      },
        error => {
          console.log('Failed to get list: ', error);
        }
      );

    do {
      await new Promise(res => setTimeout(res, 5));
    } while (!bList);
    return rv;
  }

  async initServerForApp(cmd: C_InitRequest): Promise<string[]> {
    console.assert(cmd.action > eResultType.eError);
    const rv: string[] = [];
    const params: any[] = [];
    params.push(JSON.stringify(cmd));
    let bList = false;

    this.http.post<any>(this.mInitServerUrl, params)
      .subscribe(list => {
        list.forEach((rn: any) => {
          rv.push(rn);
        });
        bList = true;
      },
        error => {
          console.log('Failed to get list: ', error);
          return rv;
        }
      );

    do {
      await new Promise(res => setTimeout(res, 5));
    } while (!bList);
    return rv;
  }

  async appAskServer(cmd: C_AskCmd): Promise< C_AppResults > {
    const params: any[] = [];
    const j = JSON.stringify(cmd);
    params.push(j);
    let bGotResults = false;
    const results = new C_AppResults();

    this.http.post<any>(this.mAskServerUrl, params)
      .subscribe( (data: C_AppResults) => {
        results.load(data);
        bGotResults = true;
      },
      error => {
        console.log(error);
      }
    );

    do {
      await new Promise(res => setTimeout(res, 5));
    } while (!bGotResults);

    return results;
  }

  async askServer(cmd: C_AskCmd): Promise<C_WcResults | null> {
    return await this.AskNetServer(cmd);
  }

  private async AskNetServer(cmd: C_AskCmd): Promise<C_WcResults | null> {
    const matchResults = new C_WcResults();
    const params: any[] = [];
    const j = JSON.stringify(cmd);
    params.push(j);

    let bGotResults = false;
    this.http.post<any>(this.mAskServerUrl, params)
      .subscribe(
        (data: C_NetResults) => {
          matchResults.land(data, cmd.mDebug);
          bGotResults = true;
        },
        error => {
          console.log(error);
          bGotResults = true;
          return null;
        }
      );
    // wait for result
    do {
      await new Promise(res => setTimeout(res, 5));
    } while (!bGotResults);

    return matchResults;
  }

  async learnPage(id: string, what: eLearn): Promise<void> {
    const learnUrl = this.baseUrl + '/learn';

    const params: any[] = [];

    params.push(what);                  // req.body[6]
    params.push(id);                  // req.body[6]

    this.http.post<any>(`${learnUrl}`, params)
      .subscribe(
        () => {
          return true;
        },
        error => {
          console.log(error);
        }
      );
  }

  async learnItem( item: C_DbItem, userId: string): Promise<boolean> {
    if (item === undefined || userId === undefined) {
      console.assert(false, 'Expecting to learn from a real item');
      return false;
    }
    const learnUrl = this.baseUrl + '/learn';

    const params: any[] = [];
    params.push(eLearn.eItemSelect); // req.body[0]
    params.push(userId);                 // req.body[1]

    params.push(item.mCategory);      // req.body[2]
    params.push(item.mUT);            // req.body[3]
    params.push(item.mPrice);         // req.body[4]
    params.push(item.mSalePrice);     // req.body[5]
    params.push(item.mRetailerName);  // req.body[6]
    params.push(item.mId);            // req.body[7]

    this.http.post<any>(`${learnUrl}`, params)
      // tslint:disable-next-line: deprecation
      .subscribe(
        () => {
          return true;
        },
        error => {
          console.log(error);
        }
      );
    return true;
  }

  genUrl( path: string): string {
    const getImageUrl = this.baseUrl + path;
    return getImageUrl;
  }

  async AskIpServer(item: C_DbItem): Promise<any> {
    let ipRes: any;

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    const params: any[] = [];

    const ipRequest = {
      url: item.mImages[0],
      Category: item.mCategory.name,
      Feature: 'sleevelength'
    };

    params.push(JSON.stringify(ipRequest));
    // params.push(ipRequest);

    let bGotResults = false;

    this.http.post<any>(`${this.ipAddress}`, params)
      .subscribe(
        (data: any) => {
          ipRes = data;
          bGotResults = true;
        },
        error => {
          console.log(error);
        }
      );
    // wait for result
    do {
      await new Promise(res => setTimeout(res, 5));
    } while (!bGotResults);
    return ipRes;
  }

  async AskIpPrediction__(item: C_DbItem): Promise<any> {
    let ipRes: any;

    const httpOptions = {
      headers: new HttpHeaders(
        {
          'Content-Type': 'application/json; charset=utf-8',
          Authorization: 'Basic bWljYWhrYW1pbmVyQGdtYWlsLGNvbToxOV9FbFJvVGE=',
      })
    };

    const params: any[] = [];
    // params.push(opt);

    const headers = {
      'Content-Type': 'application/json; charset=utf-8',
      Authorization: 'Basic bWljYWhrYW1pbmVyQGdtYWlsLGNvbToxOV9FbFJvVGE='
    };

    const jsonHeader = JSON.stringify(httpOptions);

    const ipRequest = {

      // url: item.mImages[0],
      url: 'https://www.terminalx.com/pub/media/catalog/product/z/0/z053580005-11625473492_1.jpg',
      // Category: item.mCategory.name,
      Category: 'Shirts',
      // Feature: item.mCategory.vals[4].name,
      Feature: ''
    };

    const body = JSON.stringify(ipRequest);
    params.push(body);
    // params.push(ipRequest);

    let bGotResults = false;

    const url = `${this.ipAddress}` + 'itemPrediction';
    this.http.post<any>(url, params, httpOptions )
      .subscribe(
        (data: any) => {
          ipRes = data;
          bGotResults = true;
        },
        error => {
          console.log(error);
          bGotResults = true;
        }
      );
    // wait for result
    do {
      await new Promise(res => setTimeout(res, 500));
    } while (!bGotResults);
    return ipRes;
  }


  async skIpPrediction_1(item: C_DbItem): Promise<any> {
    let bGotResults = false;
    let ipRes: any;
    const myHeaders = {
      'content-type': 'application/json; charset=utf-8',
      Authorization: 'Basic bWljYWhrYW1pbmVyQGdtYWlsLGNvbToxOV9FbFJvVGE=' };


    const ipRequest = {
      url: 'https://www.terminalx.com/pub/media/catalog/product/z/0/z053580005-11625473492_1.jpg',
      Category: 'Shirts',
      Feature: ''
    };

    const body = JSON.stringify(ipRequest);
    // const url = this.ipAddress + 'itemPrediction';
    const url = 'https://hookb.in/G9XrbrqpKGuE2xPP2kQB';

    // console.log(url, body);


    // this.http.post(url, { headers: myHeaders })
    this.http.post(url, { headers: myHeaders } )
    .subscribe(
      (data: any) => {
        // console.log(data);
        bGotResults = true;
        ipRes = data;
      },
      error => {
        console.log(error);
      }
    );

    do {
      await new Promise(res => setTimeout(res, 5));
    } while (!bGotResults);
    return ipRes;
  }




  async AskIpPrediction(urlImage: string, categoryImage: string): Promise<any> {

    let bGotResults = false;
    const url = this.ipAddress + 'itemPrediction';
    let res: any;

    const headers = { 'content-type': 'application/json; charset=utf-8' };
    const testBody = {
      url: 'https://www.terminalx.com/pub/media/catalog/product/z/0/z053580005-11625473492_1.jpg',
      Category: 'Shirts',
      Feature: ''
    };

    const body = {
      url: urlImage,
      Category: categoryImage,
      Feature: ''
    };

    console.log('Sending: ', body);
    this.http.post<any>(url, body, { headers })
    .subscribe(data => {
      res = data;
      // console.log(data);
      bGotResults = true;
      return res;
    },
    error => {
      console.log(error);
    });

    do {
      // tslint:disable-next-line: no-shadowed-variable
      await new Promise( res => setTimeout(res, 5));
    } while (!bGotResults);

    return res;
  }


}

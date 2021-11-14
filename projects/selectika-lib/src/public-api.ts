/*
 * Public API Surface of selectika-lib
 */

import { from } from 'rxjs';

export * from './lib/common/app.configService';
export * from './lib/common/ask.service';
export * from './lib/common/C_Cookies';

export * from './lib/slk-lib/gam/C_AbsCategory';
export * from './lib/slk-lib/gam/C_AbsDictionary';
export * from './lib/slk-lib/gam/C_AbsFeature';
export * from './lib/slk-lib/gam/C_AbsGeneral';
// export * from './lib/slk-lib/gam/C_ApiDbCustomers';
// export * from './lib/slk-lib/gam/C_ApiDbItems';
// export * from './lib/slk-lib/gam/C_ApiDbTaggersInfo';
export * from './lib/slk-lib/gam/C_AppSelect';
export * from './lib/slk-lib/gam/C_ConditionalTags';
export * from './lib/slk-lib/gam/C_Customer';
export * from './lib/slk-lib/gam/C_DbItem';
export * from './lib/slk-lib/gam/C_Dictionary';
// export * from './lib/slk-lib/gam/C_Excel';
// export * from './lib/slk-lib/gam/C_ExcelData';
export * from './lib/slk-lib/gam/C_FeatureInfo';
// export * from './lib/slk-lib/gam/C_File';
export * from './lib/slk-lib/gam/C_LineData';
export * from './lib/slk-lib/gam/C_Page';
export * from './lib/slk-lib/gam/C_PageControl';
export * from './lib/slk-lib/gam/C_ReUtCaFeTa';
export * from './lib/slk-lib/gam/C_ResultDef';
export * from './lib/slk-lib/gam/C_RetailerData';
export * from './lib/slk-lib/gam/C_Selector';
export * from './lib/slk-lib/gam/C_ServerCmd';
export * from './lib/slk-lib/gam/C_TagInfo';
export * from './lib/slk-lib/gam/C_User';
export * from './lib/slk-lib/gam/C_UserTypeConfig';
export * from './lib/slk-lib/gam/Enums';

// export * from './lib/slk-lib/inc/C_AbsAlg';
// export * from './lib/slk-lib/inc/C_AdditionalData';
// export * from './lib/slk-lib/inc/C_AlgCategory';
// export * from './lib/slk-lib/inc/C_AlgFeature';
// export * from './lib/slk-lib/inc/C_AlgItem';
// export * from './lib/slk-lib/inc/C_AlgResults';
// export * from './lib/slk-lib/inc/C_DeltaE';
// export * from './lib/slk-lib/inc/C_F0_alg';
// export * from './lib/slk-lib/inc/C_F1_alg';
// export * from './lib/slk-lib/inc/C_F2_alg';
// export * from './lib/slk-lib/inc/C_F3_alg';
// export * from './lib/slk-lib/inc/C_Funnel';
// export * from './lib/slk-lib/inc/C_Loc';
// export * from './lib/slk-lib/inc/C_ParseError';
// export * from './lib/slk-lib/inc/C_QueryParam';
// export * from './lib/slk-lib/inc/C_RetailerAlg';
// export * from './lib/slk-lib/inc/C_Rulers';
// export * from './lib/slk-lib/inc/C_Similar';
// export * from './lib/slk-lib/inc/C_System';
// // export * from './lib/slk-lib/inc/C_TruthMatrix';
// export * from './lib/slk-lib/inc/C_UserType';
// export * from './lib/slk-lib/inc/C_UserTypeAlgs';
// // export * from './lib/slk-lib/inc/customersModel';
// // export * from './lib/slk-lib/inc/itemsModel';
// // export * from './lib/slk-lib/inc/tagsModel';



// Components
export * from './lib/components/canvas/canvas.component';
export * from './lib/components/tag-feature/tag-feature.component';
export * from './lib/components/retailer-select/retailer-select.component';
export * from './lib/components/tag-item-category/tag-item-category.component';
export * from './lib/components/tag-user-category/tag-user-category.component';

// Services
export * from './lib/services/firebased/firebase.service';
export * from './lib/services/auth/auth.guard';
export * from './lib/services/auth/constants';


// Module
export * from './lib/selectika-lib.module';
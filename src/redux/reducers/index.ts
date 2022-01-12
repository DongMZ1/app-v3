import { Reducer } from 'redux'
type TReduxReducer = Reducer;

export type Tappstate = {
   projects: undefined | any[]
   userInfo: any;
   userRole: {organizations: any[], projects: any[]} | undefined;
   currentOrgID: string | undefined;
   modalMessage: string;
   showModal: boolean;
   currentOrgRole: string | undefined;
   allOrganizations: any[] | undefined;
   selectedProject: undefined | any;
   quoteDetail: undefined | any;
   selectedQuoteUnit: undefined | any;
}
const initialState = {
   projects: undefined,
   userInfo: undefined,
   userRole: undefined,
   currentOrgID: undefined,
   currentOrgRole: undefined,
   allOrganizations: undefined,
   modalMessage: '',
   showModal: false,
   selectedProject: undefined,
   quoteDetail: undefined,
   selectedQuoteUnit: undefined,
}
const ReduxReducer: TReduxReducer = (state: Tappstate = initialState, action: any) => {
	return {
	  ...state,
	  [action.type]: action.payload,
	}
  }
export default ReduxReducer;

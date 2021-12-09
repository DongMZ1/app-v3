import { Reducer } from 'redux'
type TReduxReducer = Reducer;

export type Tappstate = {
   projects: null | any[]
   userInfo: any;
   userRole: {organizations: any[], projects: any[]} | null;
}
const initialState = {
   projects: null,
   userInfo: null,
   userRole: null,
}
const ReduxReducer: TReduxReducer = (state: Tappstate = initialState, action: any) => {
	return {
	  ...state,
	  [action.type]: action.payload,
	}
  }
export default ReduxReducer;

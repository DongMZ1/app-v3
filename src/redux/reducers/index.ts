import { Reducer } from 'redux'
type TReduxReducer = Reducer;

export type Tappstate = {
   projects: undefined | any[]
   userInfo: any;
   userRole: {organizations: any[], projects: any[]} | undefined;
}
const initialState = {
   projects: undefined,
   userInfo: undefined,
   userRole: undefined,
}
const ReduxReducer: TReduxReducer = (state: Tappstate = initialState, action: any) => {
	return {
	  ...state,
	  [action.type]: action.payload,
	}
  }
export default ReduxReducer;

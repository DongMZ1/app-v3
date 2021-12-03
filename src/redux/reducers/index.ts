import { Reducer } from 'redux'
type TReduxReducer = Reducer;

export type Tappstate = {
   projects: null | any[]
}
const initialState = {
   projects: null
}
const ReduxReducer: TReduxReducer = (state: Tappstate = initialState, action: any) => {
	return {
	  ...state,
	  [action.type]: action.payload,
	}
  }
export default ReduxReducer;

import { Reducer } from 'redux'
type TReduxReducer = Reducer;

type InitialState = {
   

}
const initialState = {

}
const ReduxReducer: TReduxReducer = (state: InitialState = initialState, action: any) => {
	return {
	  ...state,
	  [action.type]: action.payload,
	}
  }
export default ReduxReducer;
export type Tappstate = ReturnType<typeof ReduxReducer>

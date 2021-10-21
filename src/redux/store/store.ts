import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import reducer from "../reducers";
import { devToolsEnhancer } from "redux-devtools-extension";

export const store = createStore(
	reducer,
	compose(applyMiddleware(thunk), devToolsEnhancer({}))
);

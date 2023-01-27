import { combineReducers } from "redux";
import boardReducer, { boardSaga } from "./boardReducer";
import { all } from "redux-saga/effects";

const rootReducer = combineReducers({ boardReducer });

export function* rootSaga() {
  yield all([boardSaga()]);
}
export default rootReducer;

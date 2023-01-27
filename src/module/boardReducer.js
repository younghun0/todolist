import * as API from "../api/posts";
import { call, put, takeEvery } from "redux-saga/effects";
import { createAction, createReducer } from "@reduxjs/toolkit";

const SEARCH_DATA_ASYNC = "SEARCH_DATA_ASYNC";
const SEARCH_DATA = "SEARCH_DATA";
const SAVE_DATA_ASYNC = "SAVE_DATA_ASYNC";
const MODIFY_DATA_ASYNC = "MODIFY_DATA_ASYNC";
const REMOVE_DATA_ASYNC = "REMOCE_DATA_ASYNC";

export const searchDataAsync = createAction(SEARCH_DATA_ASYNC);
export const searchData = createAction(SEARCH_DATA);
export const saveDataAsync = createAction(SAVE_DATA_ASYNC);
export const modifyDataAsync = createAction(MODIFY_DATA_ASYNC);
export const removeDataAsync = createAction(REMOVE_DATA_ASYNC);

export function* boardSaga() {
  yield takeEvery(SEARCH_DATA_ASYNC, searchDataSaga);
  yield takeEvery(SAVE_DATA_ASYNC, saveDataSaga);
  yield takeEvery(MODIFY_DATA_ASYNC, modifyDataSaga);
  yield takeEvery(REMOVE_DATA_ASYNC, removeDataSaga);
}

export function* searchDataSaga({ payload: page }) {
  const response = yield call(API.getData, page);
  yield put(searchData(response));
}

// input
export function* saveDataSaga({ payload }) {
  const response = yield call(API.saveData, payload);
  yield response;
}
export function* modifyDataSaga({ payload }) {
  console.log(payload);
  const response = yield call(API.modifyData, payload);
  yield response;
}

// Remove
export function* removeDataSaga({ payload }) {
  const response = yield call(API.removeData, payload.id);
}

// initState
const initialState = {
  todos: [],
  success: false,
};

// Toolkit Reducer
export default createReducer(initialState, {
  [SEARCH_DATA]: (state, { payload: data }) => {
    state.todos = data.todos;
    // state.todos = state.todos.concat(data.todos);
    state.success = data.success;
  },
});

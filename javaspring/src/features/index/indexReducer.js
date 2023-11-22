import { createSlice } from "@reduxjs/toolkit";

import { takeLatest, takeEvery } from "redux-saga/effects";
import * as indexAPI from "features/index/indexAPI";
import {
  createActionState,
  createRequestSaga,
  handleAsyncAction,
  reducerUtils,
} from "utils/asyncUtils";

const prefix = "index";
const GET_CACHE_DATA = "index/getCacheData";

const initialState = {
  cacheData: reducerUtils.init(),
};
const defaultState = {
  [GET_CACHE_DATA]: "cacheData",
};

// server에서 공통 cache data 조회
export const getCacheDataSaga = createRequestSaga(
  GET_CACHE_DATA,
  indexAPI.getCacheData
);

export function* indexSaga() {
  yield takeLatest(GET_CACHE_DATA, getCacheDataSaga);
}

export const indexSlice = createSlice({
  // 액션 타입 문자열의 prefix
  name: prefix,

  // 초기값
  initialState,

  // 리듀서
  reducers: {
    getCacheData: (state, action) => {},
  },

  // 서버통신 reducer
  extraReducers: (builder) => {
    builder.addMatcher(
      (action) => {
        return action.type.includes(prefix);
      },
      (state, action) => {
        state[createActionState(action, defaultState)] =
          handleAsyncAction(action); // 변경 사항
      }
    );
  },
});

export const indexAction = indexSlice.actions;

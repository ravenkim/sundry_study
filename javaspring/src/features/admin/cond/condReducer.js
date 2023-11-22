import { createSlice } from "@reduxjs/toolkit";
import { takeLatest } from "redux-saga/effects";
import * as condAPI from "features/admin/cond/condAPI";

import {
  createActionState,
  createRequestSaga,
  handleAsyncAction,
  reducerUtils,
} from "utils/asyncUtils";

const prefix = "cond";

const GET_COND_LIST = "cond/getCondList";
const GET_COND = "cond/getCond";
const INSERT_COND = "cond/insertCond";
const UPDATE_COND = "cond/updateCond";

const initialState = {
  condList: reducerUtils.init(),
  condDetail: reducerUtils.init(),
  insertCondState: reducerUtils.init(),
  updateCondState: reducerUtils.init(),
};

const defaultState = {
  [GET_COND_LIST]: "condList",
  [GET_COND]: "condDetail",
  [INSERT_COND]: "insertCondState",
  [UPDATE_COND]: "updateCondState"
};

export const getCondListSaga = createRequestSaga(
  GET_COND_LIST,
  condAPI.getCondList,
  "condList"
);
export const getCondSaga = createRequestSaga(
  GET_COND,
  condAPI.getCond,
  "condDetail"
);

export const insertCondSaga = createRequestSaga(
  INSERT_COND,
  condAPI.insertCond,
);

export const updateCondSaga = createRequestSaga(
  UPDATE_COND,
  condAPI.updateCond,
);

export function* condSaga() {
  yield takeLatest(GET_COND_LIST, getCondListSaga);
  yield takeLatest(GET_COND, getCondSaga);
  yield takeLatest(INSERT_COND, insertCondSaga);
  yield takeLatest(UPDATE_COND, updateCondSaga);
}

export const condSlice = createSlice({
  // 액션 타입 문자열의 prefix
  name: prefix,

  // 초기값
  initialState,

  // 리듀서
  reducers: {
    getCondList: (state, action) => {},
    getCond: (state, action) => {},
    insertCond: (state, action) => {},
    updateCond: (state, action) => {},
    initialize: (state, action) => {
      return {
        ...state,
        [action.payload]: reducerUtils.init(),
      };
    },
  },

  extraReducers: (builder) => {
    builder.addMatcher(
      (action) => {
        return action.type.includes(prefix);
      },
      (state, action) => {
        state[createActionState(action, defaultState)] =
          handleAsyncAction(action);
      }
    );
  },
});

export const condAction = condSlice.actions;

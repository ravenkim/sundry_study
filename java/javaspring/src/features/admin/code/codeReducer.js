import { createSlice } from "@reduxjs/toolkit";
import { takeLatest } from "redux-saga/effects";
import * as codeAPI from "features/admin/code/codeAPI";

import {
  createActionState,
  createRequestSaga,
  handleAsyncAction,
  reducerUtils,
} from "utils/asyncUtils";

const prefix = "code";

const GET_CODE_LIST = "code/getCodeList";
const GET_CODE = "code/getCode";
const INSERT_CODE = "code/insertCode";
const UPDATE_CODE = "code/updateCode";

const initialState = {
  codeList: reducerUtils.init(),
  codeDetail: reducerUtils.init(),
};

const defaultState = {
  [GET_CODE_LIST]: "codeList",
  [GET_CODE]: "codeDetail",
};

export const getCodeListSaga = createRequestSaga(
  GET_CODE_LIST,
  codeAPI.getCodeList,
  "codeList"
);
export const getCodeSaga = createRequestSaga(
  GET_CODE,
  codeAPI.getCode,
  "codeDetail"
);

export const insertCodeSaga = createRequestSaga(
  INSERT_CODE,
  codeAPI.insertCode,
  "insertCode"
);

export const updateCodeSaga = createRequestSaga(
  UPDATE_CODE,
  codeAPI.updateCode,
  "updateCode"
);

export function* codeSaga() {
  yield takeLatest(GET_CODE_LIST, getCodeListSaga);
  yield takeLatest(GET_CODE, getCodeSaga);
  yield takeLatest(INSERT_CODE, insertCodeSaga);
  yield takeLatest(UPDATE_CODE, updateCodeSaga);
}

export const codeSlice = createSlice({
  // 액션 타입 문자열의 prefix
  name: prefix,

  // 초기값
  initialState,

  // 리듀서
  reducers: {
    getCodeList: (state, action) => {},
    getCode: (state, action) => {},
    insertCode: (state, action) => {},
    updateCode: (state, action) => {},
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

export const codeAction = codeSlice.actions;

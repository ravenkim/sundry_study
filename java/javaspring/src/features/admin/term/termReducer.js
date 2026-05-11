import { createSlice } from "@reduxjs/toolkit";
import { takeLatest } from "redux-saga/effects";
import * as termAPI from "features/admin/term/termAPI";

import {
  createActionState,
  createRequestSaga,
  handleAsyncAction,
  reducerUtils,
} from "utils/asyncUtils";

const prefix = "terms";

const GET_TERM = "terms/getTerm";
const INSERT_TERM = "terms/insertTerm";
const DELETE_TERM = "terms/deleteTerm";
const MULTI_DELETE_TERM = "terms/multiDeleteTerm";

const initialState = {
  termList: reducerUtils.init(),
  termDetail: reducerUtils.init(),
};

const defaultState = {
  [GET_TERM]: "termList",
  [INSERT_TERM]: "insertTerm",
  [DELETE_TERM]: "deleteTerm",
  [MULTI_DELETE_TERM]: "multiDeleteTerm",
}

export const getTermSaga = createRequestSaga(
  GET_TERM,
  termAPI.getTerm
);

export const insertTermSaga = createRequestSaga(
  INSERT_TERM,
  termAPI.insertTerm
);

export const deleteTermSaga = createRequestSaga(
  DELETE_TERM,
  termAPI.deleteTerm
);

export const multiDeleteTerm = createRequestSaga(
  MULTI_DELETE_TERM,
  termAPI.multiDeleteTerm
);


export function* termSaga() {
  yield takeLatest(GET_TERM, getTermSaga);
  yield takeLatest(INSERT_TERM, insertTermSaga);
  yield takeLatest(DELETE_TERM, deleteTermSaga);
  yield takeLatest(MULTI_DELETE_TERM, multiDeleteTerm);
};

export const termSlice = createSlice({
  // 액션 타입 문자열의 prefix
  name: prefix,

  // 초기값
  initialState,

  // 리듀서
  reducers: {
    getTerm: (state, action) => {},
    insertTerm: (state, action) => {},
    deleteTerm: (state, action) => {},
    multiDeleteTerm: (state, action) => {},

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

export const termAction = termSlice.actions;

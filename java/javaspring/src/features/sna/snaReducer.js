import { createSlice } from "@reduxjs/toolkit";

import { takeLatest } from "redux-saga/effects";
import * as snaAPI from "features/sna/snaAPI";
import {
  createActionState,
  createRequestSaga,
  handleAsyncAction,
  reducerUtils,
} from "utils/asyncUtils";

const prefix = "sna";

const GET_ISSUES_LIST = "sna/getIssueList";
const GET_WORD_SEARCH = "sna/getWordSearch";
const GET_WORDCOUNT_SEARCH = "sna/getWordCountSearch";
const GET_DETAIL_DATA = "sna/getDetailData";
const GET_LIME_WORD = "sna/getLimeWord";
const GET_LIME_WORD_AUTOCOMPLETE = "sna/getLimeWordAutocomplete";

const initialState = {
  wordSearch: reducerUtils.init(),
  wordcountSearch: reducerUtils.init(),
  issueList: reducerUtils.init(),
  limeWordAutocomplete: reducerUtils.init(),
  limeWord: reducerUtils.init(),
};

const defaultState = {
  [GET_ISSUES_LIST]: "issueList",
  [GET_WORD_SEARCH]: "wordSearch",
  [GET_WORDCOUNT_SEARCH]: "wordcountSearch",
  [GET_DETAIL_DATA]: "detailData",
  [GET_LIME_WORD]: "limeWord",
  [GET_LIME_WORD_AUTOCOMPLETE]: "limeWordAutocomplete",
};

export const getIssueListSaga = createRequestSaga(
  GET_ISSUES_LIST,
  snaAPI.getIssueList
);

export const getWordSearchSaga = createRequestSaga(
  GET_WORD_SEARCH,
  snaAPI.getWordSearch
);

export const getWordCountSearchSaga = createRequestSaga(
  GET_WORDCOUNT_SEARCH,
  snaAPI.getWordcountSearch
);

export const getDetailDataSaga = createRequestSaga(
  GET_DETAIL_DATA,
  snaAPI.getDetailData
);
export const getLimeWordSaga = createRequestSaga(
        GET_LIME_WORD,
        snaAPI.getLimeWord
);
export const getLimeWordAutocompleteSaga = createRequestSaga(
        GET_LIME_WORD_AUTOCOMPLETE,
        snaAPI.getLimeWordAutocomplete
);



export function* snaSaga() {
  yield takeLatest(GET_ISSUES_LIST, getIssueListSaga);
  yield takeLatest(GET_WORD_SEARCH, getWordSearchSaga);
  yield takeLatest(GET_WORDCOUNT_SEARCH, getWordCountSearchSaga);
  yield takeLatest(GET_DETAIL_DATA, getDetailDataSaga);
  yield takeLatest(GET_LIME_WORD, getLimeWordSaga);
  yield takeLatest(GET_LIME_WORD_AUTOCOMPLETE, getLimeWordAutocompleteSaga);
}

export const snaSlice = createSlice({
  // 액션 타입 문자열의 prefix
  name: prefix,

  // 초기값
  initialState,

  // 리듀서
  reducers: {
    getIssueList: (state, action) => {},
    getWordSearch: (state, action) => {},
    getWordCountSearch: (state, action) => {},
    getDetailData: (state, action) => {},
    getLimeWord: (state, action) => {},
    getLimeWordAutocomplete: (state, action) => {},
  },

  // 서버통신 reducer
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

export const snaAction = snaSlice.actions;

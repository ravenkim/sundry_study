import { createSlice } from "@reduxjs/toolkit";

import { takeLatest } from "redux-saga/effects";
import * as chartAPI from "features/chart/chartAPI"

import {
  createActionState,
  createRequestSaga,
  handleAsyncAction,
  reducerUtils,
} from "utils/asyncUtils";

const prefix = "chart";

const GET_CHART_LIST = "chart/getChartList";

const initialState = {
  chartList: reducerUtils.init(),
};

const defaultState = {
  [GET_CHART_LIST]: "chartList",
}

export const getChartListSaga = createRequestSaga(
  GET_CHART_LIST,
  chartAPI.getChartList
);

export function* chartSaga() {
  yield takeLatest(GET_CHART_LIST, getChartListSaga);
};

export const chartSlice = createSlice({
  name: prefix,

  initialState,

  reducers: {
    getChartList: (state, action) => {},
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

export const chartAction = chartSlice.actions;
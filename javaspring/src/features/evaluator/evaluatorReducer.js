import { createSlice } from "@reduxjs/toolkit";
import {
    createActionState,
    createRequestSaga,
    handleAsyncAction,
    reducerUtils,
} from "utils/asyncUtils";
import { takeLatest } from "redux-saga/effects";
import {
    assignEvaluator,
    getAncmList,
    getBrdnBuclCd,
    getCmitDetail,
    getCmitList, getCmitMbrDetail,
    getEvaluatorCondition,
    reAssignEvaluator
} from "features/evaluator/evaluatorAPI";


const prefix = "evaluator";

const GET_BRDN_BUCL_CD = "evaluator/getBrdnBuclCd";
const GET_ANCM_LIST = "evaluator/getAncmList";
const GET_EVALUATOR_CONDITION = "evaluator/getEvaluatorCondition";
const GET_CMIT_LIST = "evaluator/getCmitList";
const GET_CMIT_DETAIL = "evaluator/getCmitDetail";
const GET_CMIT_MBR_DETAIL = "evaluator/getCmitMbrDetail";
const ASSIGN_EVALUATOR = "evaluator/assignEvaluator";
const RE_ASSIGN_EVALUATOR = "evaluator/reAssignEvaluator";

const initialState = {
    brdnOnelvlList: reducerUtils.init(),
    brdnTwolvlList: reducerUtils.init(),
    brdnThreelvlList: reducerUtils.init(),
    ancmList: reducerUtils.init(),
    evalCondition: reducerUtils.init(),
    cmitList: reducerUtils.init(),
    cmitDetail: reducerUtils.init(),
    cmitMbrDetail: reducerUtils.init(),
    assignEvaluatorState: reducerUtils.init(),
    reAssignEvaluatorState: reducerUtils.init(),
};

const defaultState = {
    [GET_BRDN_BUCL_CD]: "brdnCdList",
    [GET_ANCM_LIST]: "ancmList",
    [GET_EVALUATOR_CONDITION]: "evalCondition",
    [GET_CMIT_LIST]: "cmitList",
    [GET_CMIT_DETAIL]: "cmitDetail",
    [GET_CMIT_MBR_DETAIL]: "cmitMbrDetail",
    [ASSIGN_EVALUATOR]: "assignEvaluatorState",
    [RE_ASSIGN_EVALUATOR]: "reAssignEvaluatorState",
};

export const getBrdnBuclCdSaga = createRequestSaga(
    GET_BRDN_BUCL_CD,
    getBrdnBuclCd
);

export const getAncmListSaga = createRequestSaga(
    GET_ANCM_LIST,
    getAncmList
);

export const getEvaluatorConditionSaga = createRequestSaga(
    GET_EVALUATOR_CONDITION,
    getEvaluatorCondition
);

export const getCmitListSaga = createRequestSaga(
    GET_CMIT_LIST,
    getCmitList
);

export const getCmitDetailSaga = createRequestSaga(
    GET_CMIT_DETAIL,
    getCmitDetail
);

export const getCmitMbrDetailSaga = createRequestSaga(
    GET_CMIT_MBR_DETAIL,
    getCmitMbrDetail
);

export const assignEvaluatorSaga = createRequestSaga(
    ASSIGN_EVALUATOR,
    assignEvaluator
);

export const reAssignEvaluatorSaga = createRequestSaga(
    RE_ASSIGN_EVALUATOR,
    reAssignEvaluator
);

export function* evaluatorSaga() {
    yield takeLatest(GET_BRDN_BUCL_CD, getBrdnBuclCdSaga);
    yield takeLatest(GET_ANCM_LIST, getAncmListSaga);
    yield takeLatest(GET_EVALUATOR_CONDITION, getEvaluatorConditionSaga);
    yield takeLatest(GET_CMIT_LIST, getCmitListSaga);
    yield takeLatest(GET_CMIT_DETAIL, getCmitDetailSaga);
    yield takeLatest(GET_CMIT_MBR_DETAIL, getCmitMbrDetailSaga);
    yield takeLatest(ASSIGN_EVALUATOR, assignEvaluatorSaga);
    yield takeLatest(RE_ASSIGN_EVALUATOR, reAssignEvaluatorSaga);
}

const evaluatorReducers = {
    initializeAll: (state, action) => {
        return initialState;
    },
    initialize: (state, action) => {
        return {
            ...state,
            [action.payload]: reducerUtils.init(),
        };
    },
    getBrdnBuclCd: (state, action) => {},
    getAncmList: (state, action) => {},
    getEvaluatorCondition: (state, action) => {},
    getCmitList: (state, action) => {},
    getCmitDetail: (state, action) => {},
    getCmitMbrDetail: (state, action) => {},
    assignEvaluator: (state, action) => {},
    reAssignEvaluator: (state, action) => {},
};

export const evaluatorSlice = createSlice({
    name: prefix,

    // 초기값
    initialState,

    // 리듀서
    reducers: evaluatorReducers,

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

export const evaluatorAction = evaluatorSlice.actions;
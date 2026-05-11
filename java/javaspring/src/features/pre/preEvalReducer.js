import { createSlice } from "@reduxjs/toolkit";
import {
    createActionState,
    createRequestSaga,
    handleAsyncAction,
    reducerUtils,
} from "utils/asyncUtils";
import { takeLatest } from "redux-saga/effects";
import {
    getAncmCmitList, getOrgnList,
    getCmpnList,
    getSbjt,
    getCmpnSbjt,
    getEvalAncmList, getEvalSbjt, getSbjtPreEvalList,
    submitBusinessPlan,
    updateCmpnDesc, getPemCommCd, getSbjtPreEvalPopup
} from "features/pre/preEvalAPI";


const prefix = "pre";

const GET_CMPN_LIST = "pre/getCmpnList";
const GET_CMPN_SBJT = "pre/getCmpnSbjt";
const GET_SBJT = "pre/getSbjt";
const UPDATE_CMPN_DESC = "pre/updateCmpnDesc";
const SUBMIT_BUSINESS_PLAN = "pre/submitBusinessPlan";
const GET_EVAL_SBJT = "pre/getEvalSbjt";
const GET_ORGN_LIST = "pre/getOrgnList";
const GET_EVAL_ANCM_LIST = "pre/getEvalAncmList";
const GET_ANCM_CMIT_LIST = "pre/getAncmCmitList";
const GET_SBJT_PRE_EVAL_LIST = "pre/getSbjtPreEvalList";
const GET_SBJT_PRE_EVAL_POP_UP = "pre/getSbjtPreEvalPopup";
const GET_PEM_COMM_CD = "pre/getPemCommCd";

const initialState = {
    cmpnList: reducerUtils.init(),
    cmpnSbjtList: reducerUtils.init(),
    sbjtData: reducerUtils.init(),
    updateCmpnDescState: reducerUtils.init(),
    submitBusinessPlanState: reducerUtils.init(),
    getEvalAncmList: reducerUtils.init(),
    getAncmCmitList: reducerUtils.init(),
    evalSbjt: reducerUtils.init(),
    orgnList: reducerUtils.init(),
    getSbjtPreEvalList: reducerUtils.init(),
    getSbjtPreEvalPopup: reducerUtils.init(),
    getPemCommCd: reducerUtils.init(),
};

const defaultState = {
    [GET_CMPN_LIST]: "cmpnList",
    [GET_CMPN_SBJT]: "cmpnSbjtList",
    [GET_SBJT]: "sbjtData",
    [UPDATE_CMPN_DESC]: "updateCmpnDescState",
    [SUBMIT_BUSINESS_PLAN]: "submitBusinessPlanState",
    [GET_EVAL_ANCM_LIST]: "getEvalAncmList",
    [GET_ANCM_CMIT_LIST]: "getAncmCmitList",
    [GET_EVAL_SBJT]: "evalSbjt",
    [GET_ORGN_LIST]: "orgnList",
    [GET_SBJT_PRE_EVAL_LIST]: "getSbjtPreEvalList",
    [GET_SBJT_PRE_EVAL_POP_UP]: "getSbjtPreEvalPopup",
    [GET_PEM_COMM_CD]: "getPemCommCd",
};


export const getCmpnListSaga = createRequestSaga(
    GET_CMPN_LIST,
    getCmpnList,
)

export const getCmpnSbjtSaga = createRequestSaga(
    GET_CMPN_SBJT,
    getCmpnSbjt
);

export const getSbjtSaga = createRequestSaga(
    GET_SBJT,
    getSbjt,
)

export const updateCmpnDescSaga = createRequestSaga(
    UPDATE_CMPN_DESC,
    updateCmpnDesc
);

export const submitBusinessPlanSaga = createRequestSaga(
    SUBMIT_BUSINESS_PLAN,
    submitBusinessPlan
);

export const getEvalAncmListSaga = createRequestSaga(
  GET_EVAL_ANCM_LIST,
  getEvalAncmList
);

export const getAncmCmitListSaga = createRequestSaga(
  GET_ANCM_CMIT_LIST,
  getAncmCmitList
);

export const getEvalSbjtSaga = createRequestSaga(
  GET_EVAL_SBJT,
  getEvalSbjt
);

export const getOrgnListSaga = createRequestSaga(
  GET_ORGN_LIST,
  getOrgnList
);

export const getSbjtPreEvalListSaga = createRequestSaga(
  GET_SBJT_PRE_EVAL_LIST,
  getSbjtPreEvalList
);

export const getSbjtPreEvalPopupSaga = createRequestSaga(
  GET_SBJT_PRE_EVAL_POP_UP,
  getSbjtPreEvalPopup
);

export const getPemCommCdSaga = createRequestSaga(
  GET_PEM_COMM_CD,
  getPemCommCd
);

export function* preEvalSaga() {
    yield takeLatest(GET_CMPN_LIST, getCmpnListSaga);
    yield takeLatest(GET_CMPN_SBJT, getCmpnSbjtSaga);
    yield takeLatest(GET_SBJT, getSbjtSaga);
    yield takeLatest(UPDATE_CMPN_DESC, updateCmpnDescSaga);
    yield takeLatest(SUBMIT_BUSINESS_PLAN, submitBusinessPlanSaga);
    yield takeLatest(GET_EVAL_ANCM_LIST, getEvalAncmListSaga);
    yield takeLatest(GET_ANCM_CMIT_LIST, getAncmCmitListSaga);
    yield takeLatest(GET_EVAL_SBJT, getEvalSbjtSaga);
    yield takeLatest(GET_ORGN_LIST, getOrgnListSaga);
    yield takeLatest(GET_SBJT_PRE_EVAL_LIST, getSbjtPreEvalListSaga);
    yield takeLatest(GET_SBJT_PRE_EVAL_POP_UP, getSbjtPreEvalPopupSaga);
    yield takeLatest(GET_PEM_COMM_CD, getPemCommCdSaga);
};

const preEvalReducers = {
    initializeAll: (state, action) => {
        return initialState;
    },
    initialize: (state, action) => {
        return {
            ...state,
            [action.payload]: reducerUtils.init(),
        };
    },
    getCmpnList: (state, action) => {},
    getCmpnSbjt: (state, action) => {},
    getSbjt: (state, action) => {},
    updateCmpnDesc: (state, action) => {},
    submitBusinessPlan: (state, action) => {},
    getEvalAncmList: (state, action) => {},
    getAncmCmitList: (state, action) => {},
    getEvalSbjt: (state, action) => {},
    getOrgnList: (state, action) => {},
    getSbjtPreEvalList: (state, action) => {},
    getSbjtPreEvalPopup: (state, action) => {},
    getPemCommCd: (state, action) => {},
};

export const preEvalSlice = createSlice({
    name: prefix,

    // 초기값
    initialState,

    // 리듀서
    reducers: preEvalReducers,

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

export const preEvalAction = preEvalSlice.actions;
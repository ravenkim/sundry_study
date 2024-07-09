import { createSlice } from "@reduxjs/toolkit";
import { takeLatest } from "redux-saga/effects";
import { createRequestSaga, extraReducers, initializeReducers, reducerUtils, reducers } from "utils/asyncUtils";
import sampleApi from "features/sample/sampleApi";




const prefix = "sample"

//변수
const initialState = {
    codeList: reducerUtils.init(),
    memberList: reducerUtils.init(),
}

//요청 state
const makeRequest = {
    getCodeList: sampleApi.getCodeList,
    getMemberList: sampleApi.getCodeList,
}


const localReducers = {
    //필요하면 
}


//*******************************************스토어에 넘겨줄것****************************************************
//복붙후 제목만 변경

    //비동기 처리
    export default function* sampleSaga() {
        for (let reducerName in makeRequest) {

                yield takeLatest(
                    `${prefix}/${reducerName}`, 
                    createRequestSaga(makeRequest[reducerName])
                )

        }
    }
    // 리덕스 툴킷 
    export const sampleSlice = createSlice({
        name: prefix,
        initialState: initialState,
        reducers:{
            ...initializeReducers(initialState),
            ...reducers(makeRequest),
            ...localReducers,
        },
        extraReducers: extraReducers(prefix, initialState)
    })

    
//*******************************************디스패치를 위한 액션****************************************************
export const sampleAction = sampleSlice.actions



import { createSlice } from "@reduxjs/toolkit";
import sampleApi from "features/sample/sampleApi";
import { put, takeLatest } from "redux-saga/effects";
import { createActionString, reducerUtils } from "utils/asyncUtils";



const prefix = "sample"

//변수
const initialState = {
    codeList: reducerUtils.init(),
    memberList: reducerUtils.init(),
}

//리듀서
const reducers = {
    getCodeList: (state, action) => {},
    getCodeListSuccess: (state, action) => {}, // 추가: 성공 액션 핸들러
    getCodeListFailure: (state, action) => {}, // 추가: 실패 액션 핸들러
    getMemberList: (state, action) => {},
}

console.log(createActionString(reducers))


//작동되는 함수들
function* workGetCodeList() {
    try {
        const response = yield sampleApi.getCodeList();
        yield put(sampleAction.getCodeListSuccess(response.data));
    } catch (error) {
        yield put(sampleAction.getCodeListFailure(error));
    }
}




//*******************************************스토어에 넘겨줄것****************************************************

    //비동기 처리
    export default function* sampleSaga() {
        yield takeLatest(`${prefix}/getCodeList`, workGetCodeList)
    }

    
    export const sampleSlice = createSlice({
        name: prefix,
        initialState: initialState,
        reducers:reducers
        
    })



//*******************************************디스패치를 위한 액션****************************************************

export const sampleAction = sampleSlice.actions
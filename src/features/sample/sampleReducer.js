import { createSlice } from "@reduxjs/toolkit";
import client from "api/client";
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
    getCodeList: () => {},
    getMemberList: () => {},
}

const reducersName = Object.keys(reducers)


function* asyncFetch (action) {
    console.log(action)
    const { type } = action;
    console.log(type)
    yield put({
        type: `${type}Start`,
    });

    try {
        const response = yield 
        yield put({
            type: `${type}Success`,
            payload: response.data,
        });
    } catch (error) {
    // 에러를 알림
    yield put({
        type: `${type}Fail`,
        payload: error.message,
    });
    }
}







//*******************************************스토어에 넘겨줄것****************************************************
    //비동기 처리
    export default function* sampleSaga() {
        for (let index = 0; index < reducersName.length; index++) {
            yield takeLatest(
                `${prefix}/${reducersName[index]}`, 
                asyncFetch
            )
        }
    }
    // 리덕스 툴킷 
    export const sampleSlice = createSlice({
        name: prefix,
        initialState: initialState,
        reducers:reducers,
        extraReducers: (builder) => {
        }
    })

//*******************************************디스패치를 위한 액션****************************************************
export const sampleAction = sampleSlice.actions
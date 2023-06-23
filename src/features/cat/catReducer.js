import { createAction, createSlice } from "@reduxjs/toolkit";
import client from "api/client";
import { reducerUtils } from 'utils/asyncUtils';


const { takeLatest, put } = require("redux-saga/effects")


//getCats 가 발생하면 비동기 처리 함수를 실행
export default function* catSaga() {
    yield takeLatest('cat/getCats', workGetCatsFetch)
}







//실행되는 비동기 함수
function* workGetCatsFetch() {
    try {
        const cats = yield client.get(("manage/codetest/"))
        yield put(catActions.getCatsSuccess(cats.data))
    } catch (error) {
        yield put(catActions.getCatsFail(error))
    }
}


function* asyncFetch () {
    //api 요청 시작을 알림 (로딩 true)
    try {
        //api 요청
        //완료 알림
    } catch (error) {
        //에러를 알림
    }
}


export const cat = createSlice({
    name: 'cat',
    initialState: reducerUtils.init(),
    
    reducers:{
        getCats: (state, action) => {
            return {
                ...state,
                ...reducerUtils.loading(state.data), 
            }
        },
        getCatsSuccess: (state, action) => {
            return {
                ...state,
                ...reducerUtils.success(action.payload), 
            }
        },
        getCatsFail: (state, action) => {
            return {
                ...state,
                ...reducerUtils.error(action.payload), 
            }
        }
    },
})

export const catActions = cat.actions
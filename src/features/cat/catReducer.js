import { createSlice } from "@reduxjs/toolkit";
import client from "api/client";
import { createActionString, reducerUtils } from 'utils/asyncUtils';


const { takeLatest, put } = require("redux-saga/effects")




//getCatsFectch 가 발생하면 비동기 처리 함수를 실행
export default function* catSaga() {
    yield takeLatest('cat/getCatsFectch', workGetCatsFetch)
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




export const cat = createSlice({
    name: 'cat',
    initialState: reducerUtils.init(),
    
    reducers:{
        getCatsFectch: (state, action) => {
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
    }
})
export const catActions = cat.actions
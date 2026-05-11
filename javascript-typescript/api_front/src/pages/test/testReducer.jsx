import {createSlice} from "@reduxjs/toolkit";
import {takeLatest, call, put} from 'redux-saga/effects';
import axios from 'axios';
import {
    apiReducers, createRequestSaga, extraReducers,
    initializeReducers,
    initialStateHandler,
    reducerUtils
} from "src/common/utils/redux/asyncUtils.jsx";


import {getTest} from "src/pages/test/testAPI.jsx";


const prefix = 'test'


//비동기 처리용 input
const asyncRequest = {
    getApi: [
        {aaaa: reducerUtils.init()},
        () => axios.get('https://jsonplaceholder.typicode.com/posts')
    ],
    getApi2: [
        {bbb: 2},
        getTest
    ],

    getApi3: [
        {edit: "succes"},
        getTest
    ],

}

//로컬 리듀서
const localReducers = {
    //필요시
}






export function* testSaga() {
    for (let reducerName in asyncRequest) {
        yield takeLatest(
            `${prefix}/${reducerName}`,
            createRequestSaga(prefix, reducerName, asyncRequest[reducerName][1])
        )
    }
}

const initialState = initialStateHandler(asyncRequest)




export const testSlice = createSlice({
    name: prefix,
    initialState: initialState,
    reducers: {
        ...initializeReducers(initialState),
        ...apiReducers(prefix, asyncRequest),
        ...localReducers
    },
    extraReducers: extraReducers(prefix, asyncRequest)

})


export const testAction = testSlice.actions
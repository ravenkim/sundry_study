import {takeLatest} from "redux-saga/effects";
import {call, put} from 'redux-saga/effects';
import {createSlice} from '@reduxjs/toolkit';
import axios from 'axios';
import {setCookie} from "../../app/cookie.jsx";
import {reducerUtils} from "../../common/utils/redux/asyncUtils.jsx";
import client from "../../api/client.jsx";


const initialState = {
    user: {
        isActive: false
        // id: token.id,
        // isActive: token.isActive,
        // isAdmin: token.isAdmin,
        // username: token.username,
        // name: token.name,
        // email: token.email,
        // groups: data.groups,
    },

}


export const loginT = (payload) =>
  client.post("login", payload);


function* login(action) {
    try {


        const response = yield call(
            () =>  client.post("login", action.payload)
        )


        const tk = response.data?.accessToken

        setCookie('tk', tk)



        yield put({
            type: 'user/loginSuccess',
            payload: tk
        });
    } catch (e) {
        yield put({
            type: 'user/loginFailure',
            payload: e.message
        });
    }
}


export function* userSaga() {
    yield takeLatest('user/login', login)
}


export const userSlice = createSlice({
    name: 'user',
    initialState: initialState,
    reducers: {
        initializeAll: (state, action) => {
            return initialState;
        },
        initialize: (state, action) => {
            //todo 하나만 초기화
        },
        login: (state, action) => {
        },
        loginSuccess: (state, action) => {
        },
        setUser: (state, action) => {
            state.user = action.payload
        },

    }
})

export const userAction = userSlice.actions













import {takeLatest} from "redux-saga/effects";
import {call, put} from 'redux-saga/effects';
import {createSlice} from '@reduxjs/toolkit';
import {removeCookie, setCookie} from "../../app/cookie.jsx";
import client from "../../api/client.jsx";
import {jwtDecode} from "jwt-decode";


const initialState = {
    user: null,
    loginErrorMsg: null,
}


export const loginT = (payload) =>
    client.post("login", payload);


//로그인 비동기 처리 > 처리가 많아지면 따로 파일 뺼것
function* login(action) {
    try {

        const response = yield call(
            () => client.post("login", action.payload)
        )

        console.log(response)
        if (response.data?.res) {
            const tk = response.data?.msg
            setCookie('tk', tk)
            yield put({
                type: 'user/loginSuccess',
                payload: tk
            });
        } else {
            yield put({
                type: 'user/loginFailure',
                payload: response.data?.msg
            });
        }


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
            state.user = jwtDecode(action.payload)
        },
        loginFailure: (state, action) => {
            state.loginErrorMsg = action.payload
        },
        //로그인 완료시 사용자 등록 (클라이언트가 인식하게끔)
        setUser: (state, action) => {
            state.user = action.payload
        },
        logout: (state, action) => {
            // 만약 토큰 추가된다면 비동기 요청을 진행한주 석세스시 값 지우고 비우기
            state.user = null
            removeCookie('tk')
        },

    }
})

export const userAction = userSlice.actions













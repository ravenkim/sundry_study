import { takeLatest } from "redux-saga/effects";
import {call, put} from 'redux-saga/effects';
import {createSlice} from '@reduxjs/toolkit';
import axios from 'axios';


function* login() {
  try {
    const response = yield call(
        //로그인 요청
        () => axios.get('https://jsonplaceholder.typicode.com/posts')
    );
    yield put({
        type: 'user/loginSuccess',
        payload: response
    });
  } catch (e) {
    yield put({
        type: 'user/loginFailure',
        payload: e.message
    });
  }
}



export function* userSaga() {
    yield takeLatest( 'user/login' ,login)
}




export const userSlice = createSlice({
	name: 'user',
	initialState: {

	},
	reducers: {
        login: (state, action) => {},
        loginSuccess: (state, action) => {
            console.log(action.payload.data)
        },
	}
})

export const userAction = userSlice.actions








//
// import axios from 'axios';
//
// import {reducerUtils, reduxMaker} from "../../common/utils/redux/asyncUtils.jsx";
//
//
// const prefix = 'user'
//
// const asyncRequest = {
//     login: [
//         {user: reducerUtils.init()},
//         () => axios.get('https://jsonplaceholder.typicode.com/posts')
//     ],
//
// }
//
//
// const localState= {}
// const localReducers = {
//     loginSuccess: (state, action) => {
//         console.log(action.payload.data)
//     },
// }
//
// export const {userSlice, userSaga, userAction} = reduxMaker(prefix, asyncRequest,localState, localReducers);
//
//
//
//
//






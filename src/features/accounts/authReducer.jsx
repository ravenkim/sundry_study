import {createSlice} from "@reduxjs/toolkit";
import { takeLatest } from "redux-saga/effects";
import {call, put} from 'redux-saga/effects';






function* login() {
  try {
    const response = yield call(
        //api 요청
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


function* authSaga() {
    yield takeLatest( 'user/login' ,login)
}



const authSlice = createSlice({
  name: 'auth',
  initialState: {

  },
  reducers: {


    loginSuccess: (state, action) => {

    },
    loginFailure: (state, action) => {

    },
  },
});

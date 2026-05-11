import {
  createRequestSaga,
  handleAsyncAction,
  reducerUtils,
} from "utils/asyncUtils";
import * as userAPI from "features/accounts/userAPI";
import { takeLatest } from "redux-saga/effects";
import { createSlice } from "@reduxjs/toolkit";
import { jwtDecodeHandler } from "features/accounts/userUtils";

const prefix = "user";
const IRIS_LOGIN = "user/iris/login";
const LOGIN = "user/login";
const LOGOUT = "user/logout";
const LOGIN_TOKEN_RESET = "user/loginTokenReset";

const initialState = {
  user: reducerUtils.init(),
  logout: reducerUtils.init(),
};

const defaultState = {
  [LOGIN]: "user",
  [LOGOUT]: "logout",
  [LOGIN_TOKEN_RESET]: "resetToken",
};

export const loginSaga = createRequestSaga(LOGIN, userAPI.login);

export const logoutSaga = createRequestSaga(LOGOUT, userAPI.logout);

export const loginTokenResetSaga = createRequestSaga(
  LOGIN_TOKEN_RESET,
  userAPI.loginTokenReset
);

export function* userSaga() {
  yield takeLatest(LOGIN, loginSaga);
  yield takeLatest(LOGOUT, logoutSaga);
  yield takeLatest(LOGIN_TOKEN_RESET, loginTokenResetSaga);
}

export const userSlice = createSlice({
  // 액션 타입 문자열의 prefix
  name: prefix,

  // 초기값
  initialState,

  // 리듀서
  reducers: {

    initialize: (state, action) => {
      return {
        ...state,
        [action.payload]: reducerUtils.init(),
      };
    },

    setUser: (state, action) => {
      state["user"].data = jwtDecodeHandler(action.payload);
    },
    login: (state, action) => {},
    loginSuccess: (state, action) => {


      state["user"].data = jwtDecodeHandler(action.payload.data);
      localStorage.setItem("user", JSON.stringify(action.payload.data));
    },
    loginError: (state, action,) => {
      state["user"].error = true;
      state["user"].errorMessage = action.payload;
    },

    logout: (state, action) => {},
    logoutSuccess: (state, action) => {
      state["user"] = reducerUtils.init();
      localStorage.removeItem("user");
    },
    logoutError: (state, action) => {
      console.log("로그아웃 실패");
    },
    loginTokenReset: (state, action) => {},
  },
});

export const userAction = userSlice.actions;

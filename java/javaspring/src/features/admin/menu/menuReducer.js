import { createSlice } from "@reduxjs/toolkit";
import { takeLatest } from "redux-saga/effects";
import * as menuAPI from "features/admin/menu/menuAPI";

import {
  createActionState,
  createRequestSaga,
  handleAsyncAction,
  reducerUtils,
} from "utils/asyncUtils";

const prefix = "menu";

const GET_MENU_LIST = "menu/getMenuList";
const GET_MENU = "menu/getMenu";
const INSERT_MENU = "menu/insertMenu";
const UPDATE_MENU = "menu/updateMenu";
const DELETE_MENU = "menu/deleteMenu";
const INSERT_MENU_AUTH = "menu/insertMenuAuth";

const initialState = {
  menuList: reducerUtils.init(),
  menuDetail: reducerUtils.init(),
  insertMenuAuthState: reducerUtils.init(),
  insertMenuState: reducerUtils.init(),
  updateMenuState: reducerUtils.init(),
};

const defaultState = {
  [GET_MENU_LIST]: "menuList",
  [GET_MENU]: "menuDetail",
  [INSERT_MENU]: "insertMenuState",
  [UPDATE_MENU]: "updateMenuState",
  [DELETE_MENU]: "deleteMenu",
  [INSERT_MENU_AUTH]: "insertMenuAuthState",
}

export const getMenuListSaga = createRequestSaga(
  GET_MENU_LIST,
  menuAPI.getMenuList
);

export const getMenuSaga = createRequestSaga(
  GET_MENU,
  menuAPI.getMenu
);

export const insertMenuSaga = createRequestSaga(
  INSERT_MENU,
  menuAPI.insertMenu
);

export const updateMenuSaga = createRequestSaga(
  UPDATE_MENU,
  menuAPI.updateMenu
);

export const deleteMenuSaga = createRequestSaga(
  DELETE_MENU,
  menuAPI.deleteMenu
);

export const insertMenuAuthSaga = createRequestSaga(
  INSERT_MENU_AUTH,
  menuAPI.insertMenuAuth
);

export function* menuSaga() {
  yield takeLatest(GET_MENU_LIST, getMenuListSaga);
  yield takeLatest(GET_MENU, getMenuSaga);
  yield takeLatest(INSERT_MENU, insertMenuSaga);
  yield takeLatest(UPDATE_MENU, updateMenuSaga);
  yield takeLatest(DELETE_MENU, deleteMenuSaga);
  yield takeLatest(INSERT_MENU_AUTH, insertMenuAuthSaga);
}

export const menuSlice = createSlice({
  // 액션 타입 문자열의 prefix
  name: prefix,

  // 초기값
  initialState,

  // 리듀서
  reducers: {
    getMenuList: (state, action) => {},
    getMenu: (state, action) => {},
    insertMenu: (state, action) => {},
    updateMenu: (state, action) => {},
    deleteMenu: (state, action) => {},
    insertMenuAuth: (state, action) => {},
    initialize: (state, action) => {
      return {
        ...state,
        [action.payload]: reducerUtils.init(),
      };
    },
  },

  extraReducers: (builder) => {
    builder.addMatcher(
      (action) => {
        return action.type.includes(prefix);
      },
      (state, action) => {
        state[createActionState(action, defaultState)] =
        handleAsyncAction(action);
      }
    );
  },
});

export const menuAction = menuSlice.actions;

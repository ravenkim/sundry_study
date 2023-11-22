import { createSlice } from "@reduxjs/toolkit";
import { takeLatest } from "redux-saga/effects";
import * as memberAPI from "features/admin/member/memberAPI";

import {
  createActionState,
  createRequestSaga,
  handleAsyncAction,
  reducerUtils,
} from "utils/asyncUtils";
import { updateMemberProfile } from 'features/admin/member/memberAPI'

const prefix = "member";

const GET_MEMBER_LIST = "member/getMemberList";
const GET_MEMBER = "member/getMember";
const INSERT_MEMBER = "member/insertMember";
const INSERT_MEMBER_IP = "member/insertMemberIp";
const DELETE_MEMBER = "member/deleteMember";
const UPDATE_MEMBER = "member/updateMember";
const UPDATE_MEMBER_PROFILE = "member/updateMemberProfile";
const MEMBER_AUTO_MIGRATE = "member/memberAutoMigrate";
const CONFIRM_PWD = "member/CONFIRM_PWD";

const initialState = {
  memberList: reducerUtils.init(),
  memberDetail: reducerUtils.init(),
  insertMemberState: reducerUtils.init(),
  insertMemberIpState: reducerUtils.init(),
  updateMemberState: reducerUtils.init(),
  memberProfileState:reducerUtils.init(),
  autoMigrate: reducerUtils.init(),
  confirmPwd : false,
};

const defaultState = {
  [GET_MEMBER_LIST]: "memberList",
  [GET_MEMBER]: "memberDetail",
  [INSERT_MEMBER]: "insertMemberState",
  [INSERT_MEMBER_IP]: "insertMemberIpState",
  [UPDATE_MEMBER]: "updateMemberState",
  [UPDATE_MEMBER_PROFILE]: "memberProfileState",
  [MEMBER_AUTO_MIGRATE] : "autoMigrate",
  [CONFIRM_PWD] : "confirmPwd",
};

export const getMemberListSaga = createRequestSaga(
  GET_MEMBER_LIST,
  memberAPI.getMemberList,
  "memberList"
);

export const getMemberSaga = createRequestSaga(
  GET_MEMBER,
  memberAPI.getMember,
  "memberDetail"
);

export const insertMemberSaga = createRequestSaga(
  INSERT_MEMBER,
  memberAPI.insertMember,
  'insertMemberState'
);

export const insertMemberIpSaga = createRequestSaga(
  INSERT_MEMBER_IP,
  memberAPI.insertMemberIp,
  'insertMemberIpState'
)

export const deleteMemberSaga = createRequestSaga(
  DELETE_MEMBER,
  memberAPI.deleteMember,
  "deleteMember"
);

export const updateMemberSaga = createRequestSaga(
  UPDATE_MEMBER,
  memberAPI.updateMember,
  "updateMember"
);

export const updateMemberProfileSaga = createRequestSaga(
  UPDATE_MEMBER_PROFILE,
  memberAPI.updateMemberProfile,
  "updateMemberProfile"
);

export const memberAutoMigrateSaga = createRequestSaga(
    MEMBER_AUTO_MIGRATE,
    memberAPI.memberAutoMigrate
)

export function* memberSaga() {
  yield takeLatest(GET_MEMBER_LIST, getMemberListSaga);
  yield takeLatest(GET_MEMBER, getMemberSaga);
  yield takeLatest(INSERT_MEMBER, insertMemberSaga);
  yield takeLatest(INSERT_MEMBER_IP, insertMemberIpSaga);
  yield takeLatest(DELETE_MEMBER, deleteMemberSaga);
  yield takeLatest(UPDATE_MEMBER, updateMemberSaga);
  yield takeLatest(UPDATE_MEMBER_PROFILE, updateMemberProfileSaga);
  yield takeLatest(MEMBER_AUTO_MIGRATE, memberAutoMigrateSaga);
};

export const memberSlice = createSlice({
  // 액션 타입 문자열의 prefix
  name: prefix,

  // 초기값
  initialState,

  // 리듀서
  reducers: {
    getMemberList: (state, action) => {},
    getMember: (state, action) => {},
    insertMember: (state, action) => {},
    insertMemberIp: (state, action) => {},
    deleteMember: (state, action) => {},
    updateMember: (state, action) => {},
    updateMemberProfile: (state, action)=>{},
    memberAutoMigrate: (state, action)=>{},
    confirmPwd: (state, action)=>{
      state['confirmPwd'] = action.payload;
      return state
    },
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

export const memberAction = memberSlice.actions;

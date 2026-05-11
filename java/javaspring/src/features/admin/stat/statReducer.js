import {
  createActionState,
  createRequestSaga, handleAsyncAction,
  reducerUtils,
} from 'utils/asyncUtils'
import * as statApi from 'features/admin/stat/statApi'
import { takeLatest } from 'redux-saga/effects'
import { createSlice } from '@reduxjs/toolkit'
const prefix = 'stat'

const GET_STAT_LIST = 'stat/getStatList'


const initialState = {
  statList: reducerUtils.init(),
}

const defaultState = {
  [GET_STAT_LIST]: 'statList',
}


export const getStatListSaga = createRequestSaga(GET_STAT_LIST, statApi.getStatList)

export function * statSaga () {
  yield takeLatest(GET_STAT_LIST, getStatListSaga)
}

export const statSlice = createSlice({
  // 액션 타입 문자열의 prefix
  name: prefix,

  // 초기값
  initialState,

  // 리듀서()
  reducers: {
    initializeAll: (state, action) => {
      return initialState
    },
    initialize: (state, action) => {
      return {
        ...state,
        [action.payload]: reducerUtils.init(),
      }
    },
    getStatList: (state, action) => {},

  },
  // 서버통신 reducer
  extraReducers: (builder) => {
    builder.addMatcher(
      (action) => {
        return action.type.includes(prefix)
      },
      (state, action) => {

        state[createActionState(action, defaultState)] =
          handleAsyncAction(action)
      }
    )
  },
})

export const statAction = statSlice.actions

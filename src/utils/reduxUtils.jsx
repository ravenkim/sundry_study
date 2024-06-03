import { createSlice } from '@reduxjs/toolkit'
import { call, put, takeLatest } from 'redux-saga/effects'

export const reducerUtils = {
  init: () => ({
    data: null,
    loading: false,
    error: false,
  }),

  loading: (prevData = null) => ({
    data: prevData,
    loading: true,
    error: false,
  }),

  success: (data = null) => ({
    data: data,
    loading: false,
    error: false,
  }),

  error: () => ({
    data: null,
    loading: false,
    error: true,
  }),
}

//비동기 state 만들기
const initialStateMaker = (apiAction) => {
  const initialState = {}
  for (const key in apiAction) {
    const value = apiAction[key][0]
    for (const innerKey in value) {
      initialState[innerKey] = value[innerKey]
    }
  }
  return initialState
}

//비동기 리듀서 만들기
const apiReducers = (prefix, asyncRequest) => {
  const reducers = {}
  for (const type in asyncRequest) {
    reducers[type] = (state, action) => {
      const key = action.type.replace(new RegExp(`^${prefix}/`), '')
      const requestInfo = asyncRequest[key][0]
      state[Object.keys(requestInfo)[0]] = reducerUtils.loading(
        state[Object.keys(requestInfo)[0]].data,
      )
    }
  }
  return reducers
}

const createRequestSaga = (prefix, reducerName, apiRequest) => {}

// 최종 리더스
export const reduxMaker = (
  prefix,
  asyncRequest = {},
  localState = {},
  localReducers = {},
) => {
  const asyncInitialState = initialStateMaker(asyncRequest)
  const final = {}
  const allInitialState = {
    ...localState,
    ...asyncInitialState,
  }

  final[`${prefix}Slice`] = createSlice({
    name: prefix,
    initialState: allInitialState,
    reducers: {
      initializeAll: () => {
        return allInitialState
      },
      initialize: (state, action) => {
        const itemName = action.payload
        if (
          state[itemName] !== undefined &&
          allInitialState[itemName] !== undefined
        ) {
          state[itemName] = allInitialState[itemName]
        }
      },
      ...apiReducers(prefix, asyncRequest),
      ...localReducers,
    },
    // extraReducers: extraReducers(prefix, asyncRequest)
  })

  //사가 만들기
  final[`${prefix}Saga`] = function* () {
    for (const reducerName in asyncRequest) {
      yield takeLatest(
        `${prefix}/${reducerName}`,
        createRequestSaga(prefix, reducerName, asyncRequest[reducerName][1]),
      )
    }
  }

  //액션 만들기
  final[`${prefix}Action`] = final[`${prefix}Slice`].actions

  return final
}

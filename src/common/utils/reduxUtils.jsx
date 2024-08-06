import { createSlice } from '@reduxjs/toolkit'
import { call, put, takeLatest } from 'redux-saga/effects'
import { useDispatch } from 'react-redux'
import { useCallback } from 'react'

export const reducerUtils = {
    init: (defaultType = null) => ({
        data: defaultType,
        loading: false,
        error: false,
        errorMsg: false,

    }),

    loading: (prevData = null) => ({
        data: prevData,
        loading: true,
        error: false,
        errorMsg: false,
    }),

    success: (data = null) => ({
        data: data,
        loading: false,
        error: false,
        errorMsg: false,
    }),

    error: () => ({
        data: null,
        loading: false,
        error: true,
        errorMsg: false,
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
                 // state[Object.keys(requestInfo)[0]].data,
            )
        }
    }
    return reducers
}

const createRequestSaga = (prefix, reducerName, apiRequest) => {
    return function* fetchApiData(action) {
        try {
            const response = yield call(() => apiRequest(action.payload)) // 여기서 apiCall은 실제 API 호출 함수입니다.
            // 여기서 값에 따라서 페이로드 작성
            //일반 예외 처리


            const result = response.data


            if(result['error']){
                    yield put({
                    type: `${prefix}/${reducerName}Fail`,
                    payload: result['data'],
                })
            } else {

                yield put({
                    type: `${prefix}/${reducerName}Success`,
                    payload:  result['data'],
                })
            }

        } catch (error) {
            //기타 예외처리
            yield put({
                type: `${prefix}/${reducerName}Fail`,
                payload: error.message,
            })
        }
    }
}



//비동기 처리 성공 실패 처리해주는 추가적인 리듀서
export const extraReducers = (prefix, asyncRequest) => {
    return (builder) => {
        builder.addMatcher(
            (action) => {
                return action.type.includes(prefix)
            },
            (state, action) => {
                if (action.type.endsWith('Success')) {
                    const key = action.type.replace(new RegExp(`^${prefix}/`), '').replace(/Success$/, '');
                    const requestInfo = asyncRequest[key][0];
                    state[Object.keys(requestInfo)[0]] = reducerUtils.success(action.payload);
                }
                if (action.type.endsWith('Fail')) {
                    const key = action.type.replace(new RegExp(`^${prefix}/`), '').replace(/Fail$/, '');
                    const requestInfo = asyncRequest[key][0];
                    state[Object.keys(requestInfo)[0]] = reducerUtils.error(action.payload);
                }
            }
        )
    }
}









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
        extraReducers: extraReducers(prefix, asyncRequest)
    })

    //사가 만들기
    final[`${prefix}Saga`] = function* () {
        for (const reducerName in asyncRequest) {
            yield takeLatest(
                `${prefix}/${reducerName}`,
                createRequestSaga(
                    prefix,
                    reducerName,
                    asyncRequest[reducerName][1],
                ),
            )
        }
    }

    //액션 만들기
    final[`${prefix}Action`] = final[`${prefix}Slice`].actions
    return final
}


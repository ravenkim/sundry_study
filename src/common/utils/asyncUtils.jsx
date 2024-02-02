//비동기 처리에 관련된 함수 모음
import {createSlice} from "@reduxjs/toolkit";
import {call, put, takeLatest} from 'redux-saga/effects';
import client from "src/api/client.jsx";
import {setCookie} from "src/app/cookie.jsx";


//reducer data 상테
export const reducerUtils = {
    init: () => ({
        data: null,
        loading: false,
        error: false,
        errorMessage: null,
    }),

    loading: (prevData = null) => ({
        data: prevData,
        loading: true,
        error: false,
        errorMessage: null,
    }),

    success: (data = null) => ({
        data: data,
        loading: false,
        error: false,
        errorMessage: null,
    }),

    error: (error) => ({
        data: null,
        loading: false,
        error: true,
        errorMessage: error,
    }),

}


//최초 비동기 리듀서 만드는 함수(로딩처리)
export const apiReducers = (prefix, asyncRequest) => {
    const reducers = {}
    for (const type in asyncRequest) {
        reducers[type] = (state, action) => {
            const key = action.type.replace(new RegExp(`^${prefix}/`), '')
            const requestInfo = asyncRequest[key][0]
            state[Object.keys(requestInfo)[0]] = reducerUtils.loading(state[Object.keys(requestInfo)[0]].data);
        }
    }
    return reducers
}


export const initializeReducers = (initialState) => {
    return {
        initializeAll: (state, action) => {
            return initialState;
        },
        initialize: (state, action) => {
            return {
                ...state,
                [action.payload]: reducerUtils.init(),
            };
        },
    }
}

//초기값 만들어주는 함수
export const initialStateHandler = (apiAction) => {
    const initialState = {}
    for (const key in apiAction) {
        const value = apiAction[key][0];
        for (const innerKey in value) {
            initialState[innerKey] = value[innerKey];
        }
    }
    return initialState
}


//api 요청이 성공 했는지 실패 했는지 확인 해서 리듀서 요청 해주는 함수
export const createRequestSaga = (prefix, reducerName, apiRequest) => {
    return function* fetchApiData(action) {
        try {


            const response = yield call(() => apiRequest(action.payload)); // 여기서 apiCall은 실제 API 호출 함수입니다.

            if (response.data instanceof Blob) {
                yield put({
                    type: `${prefix}/${reducerName}Success`,
                    payload: response
                });
            } else if (response.data.res) {
                yield put({
                    type: `${prefix}/${reducerName}Success`,
                    payload: response.data
                });
            } else {
                yield put({
                    type: `${prefix}/${reducerName}Fail`,
                    payload: response.data
                });
            }

        } catch (error) {
            yield put({
                type: `${prefix}/${reducerName}Fail`,
                payload: error.message,
            });
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

                    if (action.payload.data instanceof Blob) {
                        if (action.payload.data.type === 'application/json') {
                            state[Object.keys(requestInfo)[0]] = reducerUtils.success(true);
                        } else {
                            const blobUrl = URL.createObjectURL(action.payload.data)
                            state[Object.keys(requestInfo)[0]] = reducerUtils.success(blobUrl);
                        }


                    } else {
                        state[Object.keys(requestInfo)[0]] = reducerUtils.success(action.payload?.data);
                    }


                }
                if (action.type.endsWith('Fail')) {
                    const key = action.type.replace(new RegExp(`^${prefix}/`), '').replace(/Fail$/, '');
                    const requestInfo = asyncRequest[key][0];
                    state[Object.keys(requestInfo)[0]] = reducerUtils.error(action.payload?.msg);
                }
            }
        )
    }
}

//로그인 비동기 처리
export function* login(action) {
    try {

        const response = yield call(
            () => client.post("login", action.payload)
        )

        if (response.data?.res) {
            const tk = response.data?.data.AccessToken
            setCookie('tk', tk)

            yield put({
                type: 'user/loginSuccessd',
                payload: tk
            });
        } else {
            yield put({
                type: 'user/loginFailured',
                payload: response.data?.msg
            });
        }


    } catch (e) {
        yield put({
            type: 'user/loginFailured',
            payload: e.message
        });
    }
}


// 편리한 자동생성기
export const reduxMaker = (prefix, asyncRequest, localState = {}, localReducers = {}) => {
    const initialState = initialStateHandler(asyncRequest)
    const final = {}

    //슬라이스 만들기
    final[`${prefix}Slice`] = createSlice({
        name: prefix,
        initialState: {
            ...localState,
            ...initialState
        },
        reducers: {
            ...initializeReducers(initialState),
            ...apiReducers(prefix, asyncRequest),
            ...localReducers

        },
        extraReducers: extraReducers(prefix, asyncRequest)

    })


    //사가 만들기
    final[`${prefix}Saga`] = function* () {
        //로그인 기능
        if(prefix === 'user') yield takeLatest('user/login', login)
        //그외
        for (const reducerName in asyncRequest) {
            yield takeLatest(
                `${prefix}/${reducerName}`,
                createRequestSaga(prefix, reducerName, asyncRequest[reducerName][1])
            )
        }
    }

    //액션 만들기
    final[`${prefix}Action`] = final[`${prefix}Slice`].actions;


    return final

}




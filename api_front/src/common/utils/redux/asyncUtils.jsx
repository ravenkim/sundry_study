//비동기 처리에 관련된 함수 모음

import {call, put} from 'redux-saga/effects';

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
        errorMessage: error.msg,
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


//api 요청이 성공했는지 실패했는지 확인해서 리듀서 요청해주는 함수
export const createRequestSaga = (prefix, reducerName, apiRequest) => {
    return function* fetchApiData() {
        try {
            const response = yield call(apiRequest); // 여기서 apiCall은 실제 API 호출 함수입니다.
            yield put({
                type: `${prefix}/${reducerName}Success`,
                payload: response
            });
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
                    state[Object.keys(requestInfo)[0]] = reducerUtils.success(action.payload.data);
                }
                if (action.type.endsWith('Fail')) {
                    const key = action.type.replace(new RegExp(`^${prefix}/`), '').replace(/Fail$/, '');
                    const requestInfo = asyncRequest[key][0];
                    state[Object.keys(requestInfo)[0]] = reducerUtils.error(action.payload.data);
                }
            }
        )
     }
}




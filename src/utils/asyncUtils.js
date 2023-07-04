import { put } from "redux-saga/effects";

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


//비동기적으로 api 요청을 처리하는 부분(액션 생성기)
export const createRequestSaga = (apiRequest) => {
    return function* (action) {
        const { type } = action;
        try {
            const response = yield apiRequest()
            yield put({
                type: `${type}Success`,
                payload: response.data,
            });
        } catch (error) {
            yield put({
                type: `${type}Fail`,
                payload: error.message,
            });
        }
    }
}


//생성된 액션에 대해서 작동하느 리듀서
export const extraReducers = (prefix, initialState) => {
    return (builder) => {
        builder.addMatcher(
            (action) => {
                return action.type.includes(prefix)
            },
            (state, action) => {

                if (action.type.endsWith('Success')) {
                    for (const key in initialState) {
                        const keyword = key.charAt(0).toUpperCase() + key.slice(1)
                        if (action.type.includes(keyword)) {
                            state[key] = reducerUtils.success(action.payload)
                        }
                    }
                }
                else if (action.type.endsWith('Fail')) {
                    for (const key in initialState) {
                        const keyword = key.charAt(0).toUpperCase() + key.slice(1)
                        if (action.type.includes(keyword)) {
                            state[key] = reducerUtils.error(action.payload)
                        }
                    }
                } else {
                    for (const key in initialState) {
                        const keyword = key.charAt(0).toUpperCase() + key.slice(1)
                        if (action.type.includes(keyword)) {
                            state = reducerUtils.loading(state[key])
                        }
                    }
                }
            }
        )
    }
}

//리듀서 자동 생성
export const reducers = (makeRequest) =>{
    const reducers = {}
    for (const reducersName in makeRequest) {
        reducers[reducersName] = (state, action) => {}
    }
    return reducers
}

//리듀서 초기화
export const initializeReducers = (initialState) => {
    const initializeReducers = {
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
    return initializeReducers
} 
import { ActionReducerMapBuilder, createSlice, Slice, SliceCaseReducers } from '@reduxjs/toolkit'
import { AxiosResponse, isAxiosError } from 'axios'
import { call, put, takeLatest } from 'redux-saga/effects'
import { AnyAction, SagaIterator } from 'redux-saga'

type AsyncState<DataType> = {
    data: DataType | null
    loading: boolean
    error: boolean
    errorMsg: string
}

//프런트에서 쓰기 위해 보여주는 값들
export const reducerUtils = {
    init: <DataType>(
        defaultType: DataType | null = null,
    ): AsyncState<DataType> => ({
        data: defaultType,
        loading: false,
        error: false,
        errorMsg: '',
    }),

    loading: <DataType>(
        prevData: DataType | null = null,
    ): AsyncState<DataType> => ({
        data: prevData,
        loading: true,
        error: false,
        errorMsg: '',
    }),

    success: <DataType>(data: DataType): AsyncState<DataType> => ({
        data: data,
        loading: false,
        error: false,
        errorMsg: '',
    }),

    error: <DataType>(
        prevData: DataType | null = null,
        errorMsg: string,
    ): AsyncState<DataType> => ({
        data: prevData,
        loading: false,
        error: true,
        errorMsg: errorMsg,
    }),
}

export interface AsyncRequest<DataType, PayloadType> {
    action: string
    state: string
    initialState: DataType

    api(payload: PayloadType): Promise<AxiosResponse>
}

//비동기 요청에서 state 만 추출
const makeAsyncRequestState = <T, U>(
    asyncRequests: readonly AsyncRequest<T, U>[] | [],
): Record<string, AsyncState<T>> => {
    return asyncRequests.reduce(
        (acc, { state, initialState }) => {
            acc[state] = reducerUtils.init(initialState)
            return acc
        },
        {} as Record<string, AsyncState<T>>,
    )
}

const getErrorMessage = (
    status: number,
    fallbackMessage: string,
    responseData?: unknown,
): string => {
    const messages: Record<number, string> = {
        400: '잘못된 요청입니다.',
        401: '인증 오류 발생: 로그인 해주세요.',
        403: '접근이 거부되었습니다.',
        404: '요청한 리소스를 찾을 수 없습니다.',
        500: '서버 오류가 발생했습니다.',
        503: '서버가 현재 사용할 수 없습니다.',
    }

    let errorMessage = messages[status] || fallbackMessage

    if (typeof responseData === 'object' && responseData !== null && 'message' in responseData) {
        errorMessage = (responseData as { message: string }).message || errorMessage
    }

    return errorMessage
}

const createRequestSaga = <PayloadType, ResponseType>(
    prefix: string,
    reducerName: string,
    api: (payload: PayloadType) => Promise<AxiosResponse<ResponseType>>,
) => {
    return function* fetchApiData(action: AnyAction) {
        try {
            const response: AxiosResponse<ResponseType> = yield call(
                api,
                action.payload,
            )


            const { status, data } = response


            if (status >= 400) {
                const errorMessage = getErrorMessage(
                    status,
                    '요청 처리 중 오류가 발생했습니다.',
                    data,
                )
                yield put({
                    type: `${prefix}/${reducerName}Fail`,
                    payload: errorMessage,
                })
                return
            }

            // TODO: 파일 다운로드 등의 특수 처리 필요 시 여기서 분기 처리

            yield put({
                type: `${prefix}/${reducerName}Success`,
                payload: data,
            })
        } catch (error: unknown) {
            const fallbackMessage = '서버에 문제가 있습니다. 관리자에게 문의하세요'
            const errorMessage = extractErrorMessage(error, fallbackMessage)

            yield put({
                type: `${prefix}/${reducerName}Fail`,
                payload: errorMessage,
            })
        }
    }
}

function extractErrorMessage(error: unknown, fallback: string): string {
    if (isAxiosError(error) && error.response) {
        return getErrorMessage(error.response.status, fallback, error.response.data)
    }

    if (error instanceof Error) {
        return error.message
    }

    return fallback
}













export function reduxMaker<
    LocalState,
    AsyncRequests extends readonly AsyncRequest<unknown, unknown>[] = [],
>(
    prefix: string,
    asyncRequests: AsyncRequests | [],
    localState: LocalState,
    localReducers: SliceCaseReducers<LocalState>,
) {
    // state 생성 로컬 state + 비동기 state
    const asyncState = makeAsyncRequestState(asyncRequests)
    const allInitialState = {
        ...localState,
        ...asyncState,
    }

    //비동기 리듀서 생성
    const asyncReducers = asyncRequests.reduce(
        (reducers, { action, state: stateKey }) => ({
            ...reducers,
            [action]: (state: typeof asyncState) => ({
                ...state,
                [stateKey]: reducerUtils.loading(state[stateKey]?.data),
            }),
        }),
        {},
    )

    const slice = createSlice({
        name: prefix,
        initialState: allInitialState,
        reducers: {
            initializeAll: () => {
                return allInitialState
            },
            initialize: (state, action) => {
                const key = action.payload
                return {
                    ...state,
                    [key]: allInitialState[key as keyof typeof allInitialState],
                }
            },
            ...localReducers,
            ...asyncReducers,
        },
        extraReducers: (builder) => {
            asyncRequests.forEach(request => {
                const { action, state: stateKey } = request;

                builder
                    .addCase(`${prefix}/${action}Success`, (state, action: AnyAction) => {
                        return {
                            ...state,
                            [stateKey]: reducerUtils.success(action.payload),
                        };
                    })
                    .addCase(`${prefix}/${action}Fail`, (state, action: AnyAction) => {
                        return {
                            ...state,
                            [stateKey]: reducerUtils.error(
                                state[stateKey]?.data,
                                action.payload,
                            ),
                        };
                    });
            });
        },

    }) as Slice

    const saga = function* () {
        for (const { action, api } of asyncRequests) {
            yield takeLatest(
                `${prefix}/${action}`,
                createRequestSaga(prefix, action, api),
            )
        }
    } as () => SagaIterator

    return {
        slice,
        actions: slice.actions,
        saga, // 명확하게 saga 포함
    } as const
}

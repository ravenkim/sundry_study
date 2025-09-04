import createSagaMiddleware from 'redux-saga'
import { configureStore } from '@reduxjs/toolkit'
import { all } from 'redux-saga/effects'
import { routerSaga, routerSlice } from 'src/app/router/routerReducer.tsx'
import { themeSlice } from 'src/shared/components/theme/themeReducer.tsx'
import { productSaga, productSlice } from 'src/features/product/productReducer'

// Slice 모음
const reducers = {
    routerReducer: routerSlice.reducer,
    themeReducer: themeSlice.reducer,
    productReducer: productSlice.reducer,
}

// Root saga
export function* rootSaga() {
    yield all([ routerSaga(), productSaga()])
}

// Saga middleware 생성
const sagaMiddleware = createSagaMiddleware()

// Store 생성
const store = configureStore({
    reducer: reducers,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({ thunk: false }).concat(sagaMiddleware),
    devTools: process.env.NODE_ENV !== 'production',
})

// TS 타입
export type AppStore = typeof store
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']

// Saga 실행
sagaMiddleware.run(rootSaga)

export default store

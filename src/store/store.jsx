import { configureStore } from '@reduxjs/toolkit'
import createSagaMiddleware from 'redux-saga'
import { all } from 'redux-saga/effects'
import { routerSlice } from 'src/routes/routerReducer.jsx'

console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa')

const reducers = {
    routerReducer: routerSlice.reducer,
}

export function* rootSaga() {
    yield all([])
}

const sagaMiddleware = createSagaMiddleware()

const middlewares = [
    // sagaMiddleware,
    // routerMiddleware
]

const store = configureStore({
    reducer: reducers,
    middleware: (getDefaultMiddleware) => [
        ...getDefaultMiddleware({
            thunk: false, // `redux-thunk` 미들웨어를 제외합니다.
        }),
    ],
})
// devTools: process.env.NODE_ENV !== 'production', 보여지는 여부

// sagaMiddleware.run(rootSaga)

export default store

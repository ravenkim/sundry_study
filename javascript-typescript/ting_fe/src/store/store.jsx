import { configureStore } from '@reduxjs/toolkit'
import createSagaMiddleware from 'redux-saga'
import { all } from 'redux-saga/effects'
import { routerSaga, routerSlice } from 'src/routes/routerReducer.jsx'
import { sampleSaga, sampleSlice } from 'src/features/sample/sampleReducer.jsx'
import { authSaga, authSlice } from 'src/features/auth/authReducer.jsx'


const reducers = {
    authReducer: authSlice.reducer,
    routerReducer: routerSlice.reducer,
    sampleReducer: sampleSlice.reducer,
}

export function* rootSaga() {
    yield all([ authSaga(), routerSaga(), sampleSaga()])
}

const sagaMiddleware = createSagaMiddleware()

const store = configureStore({
    reducer: reducers,
    middleware: (getDefaultMiddleware) => {
        return [sagaMiddleware]
    },
    // devTools: process.env.NODE_ENV !== 'production', 보여지는 여부
})

sagaMiddleware.run(rootSaga)

export default store

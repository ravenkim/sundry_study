import createSagaMiddleware from 'redux-saga'
import { configureStore, Tuple } from '@reduxjs/toolkit'
import { all } from 'redux-saga/effects'

// import { routerSaga, routerSlice } from './router/routerReducer'
import { sampleSlice, sampleSaga } from '@/features/sample/sampleReducer'
// import { themeSlice } from '../shared/components/theme/themeReducer'

const reducers = {
    // routerReducer: routerSlice.reducer,
    sampleReducer: sampleSlice.reducer,
    // themeReducer: themeSlice.reducer,
}

export function* rootSaga() {
    yield all([
        sampleSaga(),
    ])
}

const sagaMiddleware = createSagaMiddleware()

const store = configureStore({
    reducer: reducers,
    middleware: () => new Tuple(sagaMiddleware),
    devTools: process.env.NODE_ENV !== 'production',
})

export type AppStore = typeof store
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']

sagaMiddleware.run(rootSaga)
export default store

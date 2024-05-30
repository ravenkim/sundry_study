import { configureStore } from '@reduxjs/toolkit'
import createSagaMiddleware from 'redux-saga'
import {all} from 'redux-saga/effects'

const reducers = {

}

export function* rootSaga() {
    yield all([

    ]);
}


const sagaMiddleware = createSagaMiddleware();

const middlewares = [
    // sagaMiddleware,
    // routerMiddleware
]




const store = configureStore({
    reducer: reducers,
    // middleware: middlewares,
    devTools: process.env.NODE_ENV !== 'production',
})

// sagaMiddleware.run(rootSaga)

export default store

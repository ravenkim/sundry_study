import { configureStore } from '@reduxjs/toolkit'
import createSagaMiddleware from 'redux-saga'

const reducers = {

}

const sagaMiddleware = createSagaMiddleware();

const middlewares = [
    sagaMiddleware,
    // routerMiddleware
]




const store = configureStore({
    reducer: reducers,
    // middleware: middlewares,
    devTools: process.env.NODE_ENV !== 'production',
})


export default store

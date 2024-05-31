import { configureStore } from '@reduxjs/toolkit'
import createSagaMiddleware from 'redux-saga'
import {all} from 'redux-saga/effects'
import {createBrowserHistory} from "history";

console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa')

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



const history = createBrowserHistory()

const store = configureStore({
    reducer: reducers,
    // middleware: middlewares,
    // devTools: process.env.NODE_ENV !== 'production', 보여지는 여부

})

// sagaMiddleware.run(rootSaga)

export default store

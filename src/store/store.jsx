import { configureStore } from '@reduxjs/toolkit'
import createSagaMiddleware from 'redux-saga'
import {all} from 'redux-saga/effects'
import {createBrowserHistory} from "history";
import {routerSlice} from 'src/routes/routerReducer.jsx';

console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa')

const reducers = {
    routerReducer: routerSlice.reducer
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

import {configureStore} from '@reduxjs/toolkit'; //스토어 생성
import {createBrowserHistory} from 'history'
import createSagaMiddleware from 'redux-saga'
import { createReduxHistoryContext } from "redux-first-history";
import {all} from 'redux-saga/effects'
import {assetsSlice} from "../assets/assetsReducer.jsx";
import {userSaga, userSlice} from "../features/accounts/userReducer.jsx";
import {adminSaga, adminSlice} from "../features/admin/adminReducer.jsx";
const {createReduxHistory, routerMiddleware, routerReducer} = createReduxHistoryContext({ history: createBrowserHistory() });





const reducers = {
    router: routerReducer,
    assetsReducer: assetsSlice.reducer,
    userReducer: userSlice.reducer,
    adminReducer: adminSlice.reducer,
}


export function* rootSaga() {
    yield all([
        userSaga(),
        adminSaga(),
    ]);
}















const sagaMiddleware = createSagaMiddleware();

const middlewares = [
    sagaMiddleware,
    routerMiddleware
]

const store = configureStore({
    reducer: reducers,
    middleware: middlewares,
})

sagaMiddleware.run(rootSaga)

export default store

export const history = createReduxHistory(store);


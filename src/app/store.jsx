import {configureStore} from '@reduxjs/toolkit'; //스토어 생성
import {connectRouter} from 'connected-react-router'
import {createBrowserHistory} from 'history'
import createSagaMiddleware from 'redux-saga'
import { createReduxHistoryContext } from "redux-first-history";
import storage from 'redux-persist/lib/storage'
import {all} from 'redux-saga/effects'
import {assetsSlice} from "../assets/assetsReducer.jsx";
import {userSlice} from "../features/accounts/userReducer.jsx";
import {persistReducer, persistStore} from "redux-persist";
import {combineReducers} from "redux";


const {
  createReduxHistory,
  routerMiddleware,
  routerReducer
} = createReduxHistoryContext({ history: createBrowserHistory() });



const reducers = {
    router: routerReducer,
    assetsReducer: assetsSlice.reducer,
    userReducer: userSlice.reducer,

}


export function* rootSaga() {
    yield all([
        // testSaga(),
    ]);
}




const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['userReducer'] // 로컬에 저장할 리듀서 목록
};

const persistedReducer = persistReducer(persistConfig, combineReducers(reducers));




const sagaMiddleware = createSagaMiddleware();

const middlewares = [
    sagaMiddleware,
    routerMiddleware
]


const store = configureStore({
    reducer: persistedReducer,
    middleware: middlewares,
})

sagaMiddleware.run(rootSaga)

export default store

export const history = createReduxHistory(store);



// local store




export const persistor = persistStore(store);

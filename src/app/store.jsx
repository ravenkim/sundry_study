import { configureStore } from '@reduxjs/toolkit'; //스토어 생성
import { connectRouter } from 'connected-react-router'
import { createBrowserHistory } from 'history'
import createSagaMiddleware from 'redux-saga'
const history = createBrowserHistory()
import { all } from 'redux-saga/effects'
import {assetsSlice} from "../assets/assetsReducer.jsx";
import {userSlice} from "../features/accounts/userReducer.jsx";

const reducers = {
    router: connectRouter(history),
    assetsReducer: assetsSlice.reducer,
    userReducer: userSlice.reducer,

}

export function* rootSaga() {
  yield all([
      // testSaga(),
  ]);
}








const sagaMiddleware = createSagaMiddleware();

const middlewares = [
  sagaMiddleware
]

const store = configureStore({
    reducer: reducers,
    middleware: middlewares,
})

sagaMiddleware.run(rootSaga)

export default store

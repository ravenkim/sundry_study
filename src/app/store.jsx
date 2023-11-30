import { configureStore } from '@reduxjs/toolkit'; //스토어 생성
import { connectRouter } from 'connected-react-router'
import { createBrowserHistory } from 'history'
import createSagaMiddleware from 'redux-saga'
const history = createBrowserHistory()
import { all } from 'redux-saga/effects'

const reducers = {
    router: connectRouter(history),
    // testReducer: testSlice.reducer,
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

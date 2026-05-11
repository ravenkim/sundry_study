import { configureStore } from '@reduxjs/toolkit'; //스토어 생성
import createSagaMiddleware from 'redux-saga'; //사가 미들웨어
import { all } from 'redux-saga/effects'; //효과를 사용하면 여러 개의 사가를 병렬로 실행하고, 모든 사가가 완료될 때까지 기다릴 수 있어서 비동기 작업을 효율적으로 관리할 수 있습니다.
import { createBrowserHistory } from 'history'; //이동하는 url 기록용
import { connectRouter } from 'connected-react-router'; //url 관리용 리듀서
import {testSaga, testSlice} from "src/pages/test/testReducer.jsx";


const history = createBrowserHistory()


//리듀서
const reducers = {
  router: connectRouter(history),
  testReducer: testSlice.reducer
}


export function* rootSaga() {
  yield all([
      testSaga(),
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
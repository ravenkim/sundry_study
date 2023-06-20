import { configureStore } from '@reduxjs/toolkit';
import { connectRouter } from 'connected-react-router';
import catSaga, { cat } from 'features/cat/catReducer';
import sampleSaga, { sampleSlice } from 'features/sample/sampleReducer';
import { createBrowserHistory } from 'history';
import createSagaMiddleware from 'redux-saga';
import { all } from 'redux-saga/effects';

const history = createBrowserHistory()


//리듀서
const reducers = {
  router: connectRouter(history),
  catReducer: cat.reducer,
  sampleReducer: sampleSlice.reducer,
}

//사가
export function* rootSaga() {
  yield all([
    catSaga(),
    sampleSaga(),
  ]);
}





//미들웨어
const sagaMiddleware = createSagaMiddleware();

const middlewares = [
  sagaMiddleware
]




//스토어
const store = configureStore({
  reducer: reducers,
  middleware: middlewares,
})



sagaMiddleware.run(rootSaga)

export default store
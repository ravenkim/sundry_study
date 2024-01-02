import {configureStore} from '@reduxjs/toolkit'; //스토어 생성
import {createBrowserHistory} from 'history'
import createSagaMiddleware from 'redux-saga'
import {createReduxHistoryContext} from "redux-first-history";
import {all} from 'redux-saga/effects'
import {assetsSlice} from "src/assets/assetsReducer.jsx";
import {userSaga, userSlice} from "src/features/accounts/userReducer.jsx";
import {adminSaga, adminSlice} from "src/features/admin/adminReducer.jsx";
import {profileSaga, profileSlice} from "src/features/profile/profileReducer.jsx";
import {cmsSaga, cmsSlice} from "src/features/cms/cmsReducer.jsx";
import {doorSaga, doorSlice} from "src/features/door/doorReducer.jsx";

const {
    createReduxHistory,
    routerMiddleware,
    routerReducer
} = createReduxHistoryContext({history: createBrowserHistory()});


const reducers = {
    router: routerReducer,
    assetsReducer: assetsSlice.reducer,
    userReducer: userSlice.reducer,
    adminReducer: adminSlice.reducer,
    profileReducer: profileSlice.reducer,
    cmsReducer: cmsSlice.reducer,
    doorReducer: doorSlice.reducer
}




export function* rootSaga() {
    yield all([
        userSaga(),
        adminSaga(),
        profileSaga(),
        cmsSaga(),
        doorSaga()
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


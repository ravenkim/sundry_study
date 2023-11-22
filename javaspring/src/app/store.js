import {combineReducers} from "@reduxjs/toolkit";
import {createBrowserHistory} from "history";
import {connectRouter, routerMiddleware} from "connected-react-router";
import {applyMiddleware, createStore} from "redux";
import {composeWithDevTools} from "redux-devtools-extension";
import {all} from "redux-saga/effects";
import createSagaMiddleware from "redux-saga";

import {codeSaga, codeSlice} from "features/admin/code/codeReducer";
import {menuSaga, menuSlice} from "features/admin/menu/menuReducer";
import {memberSaga, memberSlice} from "features/admin/member/memberReducer";
import {condSaga, condSlice} from "features/admin/cond/condReducer";
import {indexSaga, indexSlice} from "features/index/indexReducer";
import {snaSaga, snaSlice} from "features/sna/snaReducer";
import {userSaga, userSlice} from "features/accounts/userReducer";
import {termSaga, termSlice} from "features/admin/term/termReducer";
import {chartSaga, chartSlice} from "features/chart/chartReducer";
import {perfSaga, perfSlice} from 'features/perf/perfReducer'
import {statSaga, statSlice} from 'features/admin/stat/statReducer'
import {evaluatorSaga, evaluatorSlice} from "features/evaluator/evaluatorReducer";
import {preEvalSaga, preEvalSlice} from "features/pre/preEvalReducer";

export const history = createBrowserHistory();

const createRootReducer = (history) =>
    combineReducers({
        router: connectRouter(history),
        userReducer: userSlice.reducer,
        indexReducer: indexSlice.reducer,
        codeReducer: codeSlice.reducer,
        snaReducer: snaSlice.reducer,
        menuReducer: menuSlice.reducer,
        termReducer: termSlice.reducer,
        memberReducer: memberSlice.reducer,
        chartReducer: chartSlice.reducer,
        perfReducer: perfSlice.reducer,
        evaluatorReducer: evaluatorSlice.reducer,
        condReducer: condSlice.reducer,
        statReducer: statSlice.reducer,
        preEvalReducer : preEvalSlice.reducer,
    });

export function* rootSaga() {
    yield all([
        indexSaga(),

        userSaga(),

        // admin
        codeSaga(),
        menuSaga(),
        termSaga(),
        memberSaga(),
        condSaga(),
        statSaga(),

        snaSaga(),
        chartSaga(),
        perfSaga(),
        evaluatorSaga(),
        preEvalSaga(),
    ]);
}

const sagaMiddleware = createSagaMiddleware();

export const createLimeStore = function configureStore(preloadedState) {
    const store = createStore(
        createRootReducer(history),
        preloadedState,
        composeWithDevTools(
            applyMiddleware(routerMiddleware(history), sagaMiddleware)
        )
    );

    sagaMiddleware.run(rootSaga);

    return store;
};

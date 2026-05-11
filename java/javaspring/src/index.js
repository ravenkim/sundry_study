import React from "react";
import ReactDOM from "react-dom";

import App from "./App";
import { createLimeStore, history } from "app/store";
import { Provider } from "react-redux";

import * as serviceWorker from "./serviceWorker";
import { indexAction } from "features/index/indexReducer";
import { setUserHandler } from "features/accounts/userUtils";

export const store = createLimeStore();

// 최초 cache data get
store.dispatch(indexAction.getCacheData());

// localstorage에 토큰정보가 있으면 로그인 유지
setUserHandler();

ReactDOM.render(
  <Provider store={store}>
    <App history={history} />
  </Provider>,

  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

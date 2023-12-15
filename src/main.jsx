import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import {Provider} from "react-redux";
import store from "./app/store.jsx";
import {CookiesProvider} from "react-cookie";

// css import
import '../src/assets/reset.css';
import '../src/assets/global/global.css';
import '../src/assets/text/font.css';
import {setUserHandler} from "./common/utils/redux/loginUtils.jsx";
//


setUserHandler()


ReactDOM.createRoot(document.getElementById('root')).render(
    <CookiesProvider defaultSetOptions={{path: '/'}}>
        <Provider store={store}>
            <App/>
        </Provider>
    </CookiesProvider>
)

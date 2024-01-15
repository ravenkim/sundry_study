import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import {Provider} from "react-redux";
import store from "./app/store.jsx";
import {CookiesProvider} from "react-cookie";
import {setUserHandler} from "src/common/utils/loginUtils.jsx";


setUserHandler()


ReactDOM.createRoot(document.getElementById('root')).render(
    <CookiesProvider defaultSetOptions={{path: '/'}}>
        <Provider store={store}>
            <App/>
        </Provider>
    </CookiesProvider>
)

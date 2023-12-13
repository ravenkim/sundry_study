import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import {Provider} from "react-redux";
import store from "./app/store.jsx";

// css import
import '../src/assets/reset.css';
import '../src/assets/global/global.css';
import '../src/assets/text/font.css';
//



ReactDOM.createRoot(document.getElementById('root')).render(
    <Provider store={store}>
        <App />
    </Provider>
)

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import {Provider} from "react-redux";
import store, {persistor} from "./app/store.jsx";
import { PersistGate } from 'redux-persist/integration/react'

// css import
import '../src/assets/reset.css';
import '../src/assets/global/global.css';
//



ReactDOM.createRoot(document.getElementById('root')).render(
    <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
        <App />
         </PersistGate>
    </Provider>
)

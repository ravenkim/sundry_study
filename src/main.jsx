import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { Provider } from 'react-redux'
import store from 'src/store/store.jsx'

//styles
import 'src/styles/reset.css'
import 'src/styles/shadcn.css'
import 'src/styles/global.scss'

//translator
import 'src/assets/locales/i18n'
import client from 'src/api/client.jsx'

function setupInterceptors(store) {
    client.interceptors.request.use(
        (config) => {
            const token = store.getState().authReducer.accessToken
            console.log(token)

            // if (token) {
            //     config.headers['Authorization'] = `Bearer ${token}`
            // }
            return config
        },
        (error) => {
            return Promise.reject(error)
        },
    )
}

// 모든 client 요청에 대해서 ac 추가
setupInterceptors(store)

ReactDOM.createRoot(document.getElementById('root')).render(
    <Provider store={store}>
        <App />
    </Provider>,
)

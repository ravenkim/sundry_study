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
import axios from 'axios'

function setupInterceptors(store) {
    client.interceptors.request.use(
        (config) => {
            const token = store.getState().authReducer.accessToken

            if (token) {
                config.headers['Authorization'] = `Bearer ${token}`
            }
            return config
        },
        (error) => {
            return Promise.reject(error)
        },
    )
    client.interceptors.response.use(
        (response) => {
            console.log('response', response)
            return response
        },
        async (error) => {
            // todo ac 가 없거나 여튼 실패한 경우 처리
            // const originalRequest = error.config;
            //
            // if (error.response.status === 401 && !originalRequest._retry) {
            //     originalRequest._retry = true;
            //
            //     try {
            //         // 쿠키에서 리프레시 토큰 가져오기
            //         const refreshToken = getCookie("refreshToken");
            //
            //         const tokenResponse = await axios.post(`${import.meta.env.VITE_API_HOST}/refresh-token`, {
            //             refreshToken
            //         });
            //
            //         const newAccessToken = tokenResponse.data.accessToken;
            //
            //         // 신규 액세스 토큰 헤더 설정
            //         setCookie("accessToken", newAccessToken, { path: '/', maxAge: 3600 });
            //
            //         originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
            //
            //         // 수정된 요청을 다시 시도
            //         return client(originalRequest);
            //     } catch (err) {
            //         // 리프레시 토큰 또한 실패 시 필요한 작업 수행
            //         console.error("Token refresh failed", err);
            //     }
            // }
            // return Promise.reject(error);
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

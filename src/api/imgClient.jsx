import axios from 'axios'
import {getCookie, removeCookie} from "src/app/cookie.jsx";
import {jwtDecode} from "jwt-decode";


const imgClient = axios.create({
    baseURL: import.meta.env.VITE_API_HOST,
    headers: {
        'Content-Type': 'multipart/form-data'
    },
    responseType: 'blob',
})

imgClient.interceptors.request.use(
    async (config) => {
        const userToken = getCookie('tk')
        if (userToken) {
            const tokenData = jwtDecode(userToken)

            if (tokenData.exp < Date.now() / 1000) {

                //토큰 만료시 요청 취소
                const cancelToken = axios.CancelToken;
                const source = cancelToken.source();
                config.cancelToken = source.token;
                source.cancel('Token expired');


                //쿠키 삭제후 리다이랙션
                removeCookie('tk')
                window.location = "/";
            } else {
                config.headers["AccessToken"] = userToken
            }




        }
        return config;
    },
    function (error) {
         if (axios.isCancel(error)) {
            console.log('Request cancelled due to token expiration.');
        } else {
            return Promise.reject(error);
        }
    }
);

export default imgClient;

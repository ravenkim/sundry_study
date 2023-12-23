import axios from 'axios'
import {getCookie, removeCookie} from "../app/cookie.jsx";
import {jwtDecode} from "jwt-decode";


const imgClient = axios.create({
    baseURL: import.meta.env.VITE_API_HOST,
    responseType: 'blob'
})

imgClient.interceptors.request.use(
    async (config) => {
        const userToken = getCookie('tk')
        if (userToken) {
            const tokenData = jwtDecode(userToken)

            if (tokenData.exp < Date.now() / 1000) {
                removeCookie('tk')
                window.location = "/";
            } else {
                config.headers["AccessToken"] = userToken
            }

        }
        return config;
    },
    function (error) {
        return Promise.reject(error);
    }
);

// axios 인스턴스 생성
const imgClientPost = axios.create({
    baseURL: import.meta.env.VITE_API_HOST,
    headers: {
    'Content-Type': 'multipart/form-data'
  }
});

imgClientPost.interceptors.request.use(
    async (config) => {
        const userToken = getCookie('tk')
        if (userToken) {
            const tokenData = jwtDecode(userToken)

            if (tokenData.exp < Date.now() / 1000) {
                removeCookie('tk')
                window.location = "/";
            } else {
                config.headers["AccessToken"] = userToken
            }

        }
        return config;
    },
    function (error) {
        return Promise.reject(error);
    }
);



export default imgClient;
export { imgClientPost };

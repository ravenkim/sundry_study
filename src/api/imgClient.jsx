import axios from 'axios'
import {getCookie, removeCookie} from "../app/cookie.jsx";
import {jwtDecode} from "jwt-decode";


const imgClient = axios.create({
    baseURL: import.meta.env.VITE_API_HOST,
    headers: {'content-type': 'multipart/form-data'}
})


imgClient.interceptors.request.use(
    async (config) => {
        const userToken = getCookie('tk')
        if (userToken) {
            const tokenData = jwtDecode(userToken)
            console.log(tokenData.exp)

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

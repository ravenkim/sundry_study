import axios from 'axios'

const client = axios.create({
    baseURL: import.meta.env.VITE_API_HOST,
})



// client.interceptors.request.use(
//     async (config) => {
//         console.log('토큰 처리 추가 예정')
//     //     const userToken = getCookie('tk')
//     //     if (userToken) {
//     //         const tokenData = jwtDecode(userToken)
//     //
//     //         if (tokenData.exp < Date.now() / 1000) {
//     //             removeCookie('tk')
//     //             window.location = "/";
//     //         } else {
//     //             config.headers["AccessToken"] = userToken
//     //         }
//     //
//     //     }
//     //     return config;
//     // },
//     // function (error) {
//     //     return Promise.reject(error);
//      }
// )


export default client
import axios from 'axios'



const client = axios.create({
    baseURL: import.meta.env.VITE_API_HOST,
    headers: {
        "Content-Type":"application/json",
    },

})


export const cookieClient= axios.create({
    baseURL: import.meta.env.VITE_API_HOST,
    headers: {
        "Content-Type":"application/json",
    },
    // 쿠키를 같이 보냄 받을떄도 필요
    withCredentials: true
})





/*
* interceptors.request 만약 accessToken 이 있다면 쿠키에 accessToken 을 담아서 요청을 보냄
* 만약 만료되었다고 오면 쿠키에 refreshToken을 담아서 보냄
* 새로운 accessToken 을 쿠키에서 가져와 저장함 혹은
* refreshToken이 만료 되었다고 오면 다 삭제하고 로그인 페이지로 이동시킴
*
* */


// client.interceptors.request.use(
//     async (config) => {
//         const accessToken = getCookie('accessToken');
//         if (accessToken) {
//             const tokenExpires = jwtDecode(accessToken).exp * 1000;
//
//             if (Date.now() < tokenExpires) {
//                 config.headers.Authorization = `Bearer ${accessToken}`;
//             } else {
//                 const refreshToken = getCookie('refreshToken');
//                 if (refreshToken) {
//                     // Assuming a function to refresh the token
//                     try {
//                         const response = await axios.post(`${import.meta.env.VITE_API_HOST}/refreshToken`, { token: refreshToken });
//                         const newAccessToken = response.data.accessToken;
//                         document.cookie = `accessToken=${newAccessToken}`;
//                         config.headers.Authorization = `Bearer ${newAccessToken}`;
//                     } catch (error) {
//                         removeCookie('accessToken');
//                         removeCookie('refreshToken');
//                         window.location.href = '/login'; // Redirect to login
//                     }
//                 } else {
//                     removeCookie('accessToken');
//                     removeCookie('refreshToken');
//                     window.location.href = '/login'; // Redirect to login
//                 }
//             }
//         }
//         return config;
//     },
//     (error) => {
//         return Promise.reject(error);
//     }
// );




// //프런트에서 점검
// client.interceptors.request.use(
//     async (config) => {
//         const userToken = getCookie('accessToken')
//         if (userToken) {
//             const tokenData = jwtDecode(userToken)
//
//             if (tokenData.exp < Date.now() / 1000) {
//                 removeCookie('accessToken')
//                 window.location = "/";
//             } else {
//
//
//
//                 config.headers["AccessToken"] = userToken
//             }
//
//         }
//         return config;
//     },
//     function (error) {
//         return Promise.reject(error);
//     }
// );



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
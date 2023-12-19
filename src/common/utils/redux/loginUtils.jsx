import store from "/src/app/store.jsx";
import {jwtDecode} from "jwt-decode";
import {userAction} from "src/features/accounts/userReducer.jsx";
import {getCookie} from "src/app/cookie.jsx";


const jwtDecodeHandler = (data) => {
    return jwtDecode(data);
};


export const setUserHandler = () => {
    try {
        const userToken = getCookie('tk')  // 쿠키에서 가져오지
        if (!userToken) {store.dispatch(userAction.initialize('user'))
            return ;
        }
        store.dispatch(userAction.setUser(jwtDecodeHandler(userToken)))
    } catch (e) {
        console.error("User Setting Exception : ", e);
    }
};


export const logoutHandler = () => {
    try {
        let user = getCookie('tk')
        if (user) {
            //  리프레시 토큰 삭제
        }
    } catch (e) {
        console.error("Logout Exception : ", e);
    }
};

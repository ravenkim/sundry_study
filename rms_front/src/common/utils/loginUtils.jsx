import store from "src/app/store.jsx";
import {jwtDecode} from "jwt-decode";
import {userAction} from "src/features/accounts/userReducer.jsx";
import {getCookie} from "src/app/cookie.jsx";


const jwtDecodeHandler = (data) => {
    return jwtDecode(data);
};


//로그인 되었을시 처리
export const setUserHandler = () => {
    try {
        const userToken = getCookie('tk')  // 쿠키에서 가져오지
        if (!userToken) {store.dispatch(userAction.initializeUser())
            return ;
        }
        store.dispatch(userAction.setUser(jwtDecodeHandler(userToken)))
        store.dispatch(userAction.getUserProfileImg());
    } catch (e) {
        console.error("User Setting Exception : ", e);
    }
};




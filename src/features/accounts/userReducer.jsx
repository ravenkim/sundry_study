
import {removeCookie, setCookie} from "src/app/cookie.jsx";
import {jwtDecode} from "jwt-decode";
import {reducerUtils, reduxMaker} from "src/common/utils/asyncUtils.jsx";
import {getUserProfileImg} from "src/features/accounts/userAPI.jsx";







const prefix = 'user'

const asyncRequest = {
    getUserProfileImg: [
        {userProfileImg: reducerUtils.init()},
        getUserProfileImg
    ],
}


const localState = {
    loginErrorMsg: null,
    user: null,
}

//로컬 리듀서
const localReducers = {
        initializeUser: (state, action) => {
            state.user = null
        },
        initializeMsg: (state, action) => {
            state.loginErrorMsg = null
        },
        login: (state, action) => {
        },
        loginSuccessd: (state, action) => {
            state.user = jwtDecode(action.payload)
        },
        loginFailured: (state, action) => {
            state.loginErrorMsg = action.payload
        },
        //로그인 완료시 사용자 등록 (클라이언트가 인식하게끔)
        setUser: (state, action) => {
            state.user = action.payload
        },
        logout: (state, action) => {
            // 만약 토큰 추가된다면 비동기 요청을 진행한주 석세스시 값 지우고 비우기
            state.user = null
            removeCookie('tk')
        },
}

export const {userSlice, userSaga, userAction} = reduxMaker(prefix, asyncRequest, localState, localReducers);










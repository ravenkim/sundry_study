import axios from 'axios';
import {
    reducerUtils, reduxMaker
} from "src/common/utils/asyncUtils.jsx";
import client from "../../api/client.jsx";
import imgClient from "../../api/imgClient.jsx";
import {
    getFullUserInfo, getUserNotifications,
    getUserProfileImg, postBoardLikes,
    postBoardRentals,
    postBoardReservations, postUserNotifications,
    postUserProfileImg,
    postUserPW
} from "./profileAPI.jsx";


const prefix = 'profile'




//비동기 처리용 input
const asyncRequest = {
    getUserProfileImg: [
        {userProfileImg: reducerUtils.init()},
        getUserProfileImg
    ],

    postUserProfileImg: [
        {postUserProfileImgStatus:reducerUtils.init()},
        postUserProfileImg
    ],

    getFullUserInfo: [
        {fullUserInfo:reducerUtils.init()},
        getFullUserInfo
    ], // 유지 언포메이션 데이터 콘솔 찍는게 안됨

    postUserPW:[
        {userPW:reducerUtils.init()},
        postUserPW
    ],

    postBoardRentals : [
        {BoardRentals:reducerUtils.init()},
        postBoardRentals
    ], // 대여목록 보드 사용자 정보 넘겨주기

    postBoardReservations : [
        {BoardReservations:reducerUtils.init()},
        postBoardReservations
    ], // 예약목록 보드 사용자 정보 넘겨주기

    postBoardLikes : [
        {BoardLikes:reducerUtils.init()},
        postBoardLikes
    ], // 예약목록 보드 사용자 정보 넘겨주기

    getUserNotifications : [
        {notifications:reducerUtils.init()},
        getUserNotifications
    ],

    postUserNotifications : [
        {notiIds:reducerUtils.init()},
        postUserNotifications
    ]

}


const localState = {
    tab: ""
}

//로컬 리듀서
const localReducers = {
    setTab: (state, action) => {
        state.tab = action.payload
        return state
    },

}

//이름만 바꿔서 사용
export const {profileSlice, profileSaga, profileAction} = reduxMaker(prefix, asyncRequest, localState, localReducers);



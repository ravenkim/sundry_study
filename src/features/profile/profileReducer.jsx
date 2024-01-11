import {reducerUtils, reduxMaker} from "src/common/utils/asyncUtils.jsx";
import {
    deleteBoardLikes,
    getFullUserInfo,
    getUserNotifications,
    getUserProfileImg,
    postBoardLikes,
    postBoardRentals,
    postBoardReservations,
    postUserNotifications,
    postUserProfileImg,
    postUserPW,
    putBoardRentalsReturn
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
    ],

    postUserPW:[
        {userPW:reducerUtils.init()},
        postUserPW
    ],

    postBoardRentals : [
        {BoardRentals:reducerUtils.init()},
        postBoardRentals
    ], // 대여목록 보드 사용자 정보 넘겨주기

    putBoardRentalsReturn:[
        {RentalsReturn:reducerUtils.init()},
        putBoardRentalsReturn
    ],// 대여중인 컨텐츠 반납으로 변경

    postBoardReservations : [
        {BoardReservations:reducerUtils.init()},
        postBoardReservations
    ], // 예약목록 보드 사용자 정보 넘겨주기

    postBoardLikes : [
        {BoardLikes:reducerUtils.init()},
        postBoardLikes
    ], // 예약목록 보드 사용자 정보 넘겨주기

    deleteBoardLikes : [
        {BoardLikesDelete:reducerUtils.init()},
        deleteBoardLikes
    ],

    getUserNotifications : [
        {notifications:reducerUtils.init()},
        getUserNotifications
    ],

    postUserNotifications : [
        {notiIds:reducerUtils.init()},
        postUserNotifications
    ],

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



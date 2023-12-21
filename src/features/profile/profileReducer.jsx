import axios from 'axios';
import {
    reducerUtils, reduxMaker
} from "src/common/utils/redux/asyncUtils.jsx";
import client from "../../api/client.jsx";
import imgClient from "../../api/imgClient.jsx";


const prefix = 'profile'




//비동기 처리용 input
const asyncRequest = {
    getUserProfileImg: [
        {userProfileImg: reducerUtils.init()},
        () => axios.get('http://110.35.15.168:8088/profile/user/img')
    ],

    postUserProfileImg: [
        {userProfileImg:reducerUtils.init()},
        (param)=>console.log(param)
    ],

    test: [
        {dddd: reducerUtils.init()},
        (param) => imgClient.post('http://110.35.15.168:8088/test', param)
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



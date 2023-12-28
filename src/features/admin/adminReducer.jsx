import {
    reducerUtils, reduxMaker
} from "src/common/utils/asyncUtils.jsx";
import {
    addUser,
    getAuthList,
    getBoardList, getOverdues,
    getUsers, getUsersDetail,
    resetPassword,
    resetProfile,
    setBoardPriorities
} from "./adminAPI.jsx";


const prefix = 'admin'




//비동기 처리용 input
const asyncRequest = {
    // getApi: [
    //     {aaaa: reducerUtils.init()},
    //     () => axios.get('https://jsonplaceholder.typicode.com/posts')
    // ],

    getUsers: [
        {users: reducerUtils.init()},
        getUsers
    ],

      getUsersDetail: [
        {userDetail: reducerUtils.init()},
        getUsersDetail
    ],


    addUser:[
        {addUserStatus: reducerUtils.init()},
        addUser
    ],

    resetPassword:[
        {resetPasswordStatus: reducerUtils.init()},
        resetPassword
    ],

    resetProfile:[
        {resetProfileStatus: reducerUtils.init()},
        resetProfile
    ],






     // 보드 관리
     getBoardList:[
        {boardList: reducerUtils.init()},
        getBoardList
    ],


    setBoardPriorities:[
        {setBoardPrioritiesStatus: reducerUtils.init()},
        setBoardPriorities
    ],



    // 연체자
    getOverdues:[
        {overdues: reducerUtils.init()},
        getOverdues
    ],



        // 권한
        getAuthList: [
        {authList: reducerUtils.init()},
        getAuthList
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
export const {adminSlice, adminSaga, adminAction} = reduxMaker(prefix, asyncRequest, localState, localReducers);



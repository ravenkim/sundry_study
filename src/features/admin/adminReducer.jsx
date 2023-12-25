import {
    reducerUtils, reduxMaker
} from "src/common/utils/asyncUtils.jsx";
import {addUser, getAuthList, getBoardList, getUsers, test} from "./adminAPI.jsx";


const prefix = 'admin'




//비동기 처리용 input
const asyncRequest = {
    // getApi: [
    //     {aaaa: reducerUtils.init()},
    //     () => axios.get('https://jsonplaceholder.typicode.com/posts')
    // ],
    test: [
        {test: reducerUtils.init()},
        test
    ],

    getUsers: [
        {users: reducerUtils.init()},
        getUsers
    ],
    getAuthList: [
        {authList: reducerUtils.init()},
        getAuthList
    ],

    addUser:[
        {addUserStatus: reducerUtils.init()},
        addUser
    ],
     getBoardList:[
        {boardList: reducerUtils.init()},
        getBoardList
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



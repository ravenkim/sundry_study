import axios from 'axios';
import {
    reducerUtils, reduxMaker
} from "src/common/utils/redux/asyncUtils.jsx";
import client from "../../api/client.jsx";




const prefix = 'admin'


//비동기 처리용 input
const asyncRequest = {
    // getApi: [
    //     {aaaa: reducerUtils.init()},
    //     () => axios.get('https://jsonplaceholder.typicode.com/posts')
    // ],
    test: [
        {test: reducerUtils.init()},
        () => client.get('testTest')
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
export const {adminSlice, adminSaga, adminAction} = reduxMaker(prefix, asyncRequest,localState, localReducers);



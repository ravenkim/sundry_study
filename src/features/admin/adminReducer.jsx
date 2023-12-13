import axios from 'axios';
import {
    reducerUtils, reduxMaker
} from "src/common/utils/redux/asyncUtils.jsx";




const prefix = 'admin'


//비동기 처리용 input
const asyncRequest = {
    // getApi: [
    //     {aaaa: reducerUtils.init()},
    //     () => axios.get('https://jsonplaceholder.typicode.com/posts')
    // ],
    
}



const localState = {
    tab: ""
}

//로컬 리듀서
const localReducers = {
     setTab: (state, action) => {
            state.tab = action.payload
     },
}

//이름만 바꿔서 사용
export const {adminSlice, adminSaga, adminAction} = reduxMaker(prefix, asyncRequest,localState, localReducers);



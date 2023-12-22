import {reducerUtils, reduxMaker} from "src/common/utils/redux/asyncUtils.jsx";
import {getBoardList} from "./cmsAPI.jsx";


const prefix = 'cms'


//비동기 처리용 input
const asyncRequest = {
    // getApi: [
    //     {aaaa: reducerUtils.init()},
    //     () => axios.get('https://jsonplaceholder.typicode.com/posts')
    // ],

    getBoardList: [
        {boardList: reducerUtils.init()},
        getBoardList
    ],



}


const localState = {}

//로컬 리듀서
const localReducers = {}

//이름만 바꿔서 사용
export const {cmsSlice, cmsSaga, cmsAction} = reduxMaker(prefix, asyncRequest, localState, localReducers);



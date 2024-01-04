import {reducerUtils, reduxMaker} from "src/common/utils/asyncUtils.jsx";
import {getBoardDetail, getBoardList, getContentDetail, getContentDetailImg} from "./cmsAPI.jsx";


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

    getBoardDetail: [
        {boardDetail:reducerUtils.init()},
        getBoardDetail
    ],

    getContentDetail: [
        {contentDetail: reducerUtils.init()},
        getContentDetail
    ],

    getContentDetailImg: [
        {contentDetailImg: reducerUtils.init()},
        getContentDetailImg
    ],

    //검색 결과




}


const localState = {}

//로컬 리듀서
const localReducers = {}

//이름만 바꿔서 사용
export const {cmsSlice, cmsSaga, cmsAction} = reduxMaker(prefix, asyncRequest, localState, localReducers);



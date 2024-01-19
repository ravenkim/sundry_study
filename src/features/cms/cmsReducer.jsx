import {reducerUtils, reduxMaker} from "src/common/utils/asyncUtils.jsx";
import {
    dislikeContent,
    getBoardDetail,
    getBoardList,
    getContentDetail,
    getContentDetailImg,
    getSearchBoard,
    likeContent
} from "./cmsAPI.jsx";


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
    ], // door에서 사용하는 보드 리스트

    getBoardDetail: [
        {boardDetail:reducerUtils.init()},
        getBoardDetail
    ], // 보드 컨텐츠 리턴

    getSearchBoard:[
        {boardSearchResult: reducerUtils.init()},
        getSearchBoard
    ], // 보드 검색결과

    getContentDetail: [
        {contentDetail: reducerUtils.init()},
        getContentDetail
    ],

    getContentDetailImg: [
        {contentDetailImg: reducerUtils.init()},
        getContentDetailImg
    ],

    //검색 결과



    //컨텐츠 좋아요 취소
    likeContent: [
        {likeContentStatus: reducerUtils.init()},
        likeContent
    ],
    dislikeContent: [
        {dislikeContentStatus: reducerUtils.init()},
        dislikeContent
    ],




}


const localState = {}

//로컬 리듀서
const localReducers = {}

//이름만 바꿔서 사용
export const {cmsSlice, cmsSaga, cmsAction} = reduxMaker(prefix, asyncRequest, localState, localReducers);



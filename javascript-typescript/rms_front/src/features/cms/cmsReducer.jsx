import {reducerUtils, reduxMaker} from "src/common/utils/asyncUtils.jsx";
import {
    dislikeContent,
    getBoardDetail,
    getBoardList,
    getCommentList,
    getContentDetail,
    getContentDetailImg,
    getSearchBoard,
    likeContent,
    saveComment,
    deleteComment,
    modifyComment,
} from "./cmsAPI.jsx";
import { all, call, put, takeEvery } from 'redux-saga/effects';


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


    // 댓글 조회 관련
    getCommentList: [
        {getCommentList: reducerUtils.init()},
        getCommentList
    ],
    saveComment: [
        {saveComment: reducerUtils.init()},
    ],
    modifyComment: [
        {modifyComment: reducerUtils.init()},
    ],
    deleteComment: [
        {deleteComment: reducerUtils.init()},
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


// 댓글 등록, 수정, 삭제 즉시 댓글 목록을 다시 불러오는 기능
function* fetchComments(contentId) {
    try {
        const commentList = yield call(getCommentList, {contentId: contentId});
        yield put({type: `${prefix}/getCommentListSuccess`, payload: commentList.data});
    } catch (commentError) {
        yield put({type: `${prefix}/getCommentListFail`, payload: commentError});
    }
}

function* saveCommentSaga(action) {
    try {
        const response = yield call(saveComment, action.payload);
        yield put({type: `${prefix}/saveCommentSuccess`, payload: response});
        yield* fetchComments(action.payload.contentId);
    } catch (error) {
        yield put({type: `${prefix}/saveCommentFail`, payload: error});
    }
}

function* deleteCommentSaga(action) {
    try {
        const response = yield call(deleteComment, action.payload);
        yield put({type: `${prefix}/deleteCommentSuccess`, payload: response});
        yield* fetchComments(action.payload.contentId);
    } catch (error) {
        yield put({type: `${prefix}/deleteCommentFail`, payload: error});
    }
}

function* modifyCommentSaga(action) {
    try {
        const response = yield call(modifyComment, action.payload);
        yield put({type: `${prefix}/modifyCommentSuccess`, payload: response});
        yield* fetchComments(action.payload.contentId);
    } catch (error) {
        yield put({type: `${prefix}/modifyCommentFail`, payload: error});
    }
}

function* watchCommentUpdates() {
    yield all([
        takeEvery(`${prefix}/saveComment`, saveCommentSaga),
        takeEvery(`${prefix}/deleteComment`, deleteCommentSaga),
        takeEvery(`${prefix}/modifyComment`, modifyCommentSaga),
    ]);
}

//이름만 바꿔서 사용
const {cmsSlice, cmsSaga, cmsAction} = reduxMaker(prefix, asyncRequest, localState, localReducers);

// 기존 사가에 새로운 watchSaveComment 추가
const combinedCmsSaga = function* () {
    yield* cmsSaga();
    yield* watchCommentUpdates();
};

export { cmsSlice, combinedCmsSaga as cmsSaga, cmsAction };



import client from "src/api/client.jsx";
import imgClient from "src/api/imgClient.jsx";

export const getBoardList = () =>
  client.get('board/list' )

export const getBoardDetail = (param) =>
    client.get(`board/${param}`)

export const getContentDetail = (param) =>
    client.get(`contents/${param}`  )


export const getContentDetailImg = (param) =>
    imgClient.get(`contents/${param}/img`  )

export const getSearchBoard = (param) =>
    client.get(`search?keyword=${param.param}&boardId=${param.boardId}`)




// 컨텐츠 좋아요, 좋아요 취소
export const likeContent = (param)=>
    client.post(`/likes`, param)

export const dislikeContent = (param)=>
    client.put(`/likes/delete`, param)


// 댓글 조회 관련
export const getCommentList = (param) =>
    client.post(`/comment/list`, param)

export const saveComment = (param) =>
    client.post(`/comment`, param)

export const modifyComment = (param) =>
    client.post(`/comment/modify`, param)

export const deleteComment = (param) =>
    client.put(`/comment/delete`, param)

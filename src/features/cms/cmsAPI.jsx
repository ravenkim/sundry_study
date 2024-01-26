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

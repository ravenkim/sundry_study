import client from "../../api/client.jsx";
import imgClient from "../../api/imgClient.jsx";

export const getBoardList = () =>
  client.get('board/list' )

export const getBoardDetail = (param) =>
    client.get(`board/${param}`)

export const getContentDetail = (param) =>
    client.get(`contents/${param}`  )


export const getContentDetailImg = (param) =>
    imgClient.get(`contents/${param}/img`  )





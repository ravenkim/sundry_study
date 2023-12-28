import client from "../../api/client.jsx";

export const getBoardList = () =>
  client.get('board/list' )



export const getContentDetail = (param) =>
    client.get(`contents/${param}`  )

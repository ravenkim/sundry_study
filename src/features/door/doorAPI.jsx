import client from "../../api/client.jsx";

export const getSearchAll = (param) =>
    client.get(`search?keyword=${param}`  )

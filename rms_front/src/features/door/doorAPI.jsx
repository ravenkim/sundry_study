import client from "src/api/client.jsx";

export const getSearchAll = (param) =>
    client.get(`search?keyword=${param}`  )

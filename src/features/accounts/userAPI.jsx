import client from "src/api/client.jsx";


export const login = (payload) =>
    client.post(
        '/login',
        payload,
    )

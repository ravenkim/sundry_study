import client from "src/api/client.jsx";
import imgClient from "src/api/imgClient.jsx";


export const login = (payload) =>
    client.post('/login', payload,)

export const getUserProfileImg = () =>
    imgClient.get('profile/user/img');

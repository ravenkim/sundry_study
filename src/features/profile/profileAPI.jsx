import imgClient, { imgClientPost } from "../../api/imgClient.jsx";
import userClient from "../../api/userClient.jsx";

export const getUserProfileImg = () =>
    imgClient.get('/profile/user/img');

export const postUserProfileImg = (param) => {
    imgClientPost.post('/profile/user/save-img', param);
}

export const getFullUserInfo = () =>
    userClient.get('/profile/user');

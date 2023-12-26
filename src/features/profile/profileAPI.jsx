import imgClient, { imgClientPost } from "../../api/imgClient.jsx";
import userClient from "../../api/userClient.jsx";

export const getUserProfileImg = () =>
    imgClient.get('/profile/user/img');

export const postUserProfileImg = (param) => {
    imgClientPost.post('/profile/user/save-img', param);
}

export const getFullUserInfo = () =>
    userClient.get('/profile/user');


export const postUserPW = (param) => {
    userClient.post('/profile/user/save-pwd', param);
}

export const postBoardRentals = (param) => {
    userClient.post('/profile/rentals', param);
}

export const postBoardReservations = (param) => {
    userClient.post('/profile/reservations', param);
}

export const postBoardLikes = (param) => {
    userClient.post('/profile/likes', param);
}

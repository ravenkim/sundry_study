import imgClient from "../../api/imgClient.jsx";
import client from "../../api/client.jsx";



export const postUserProfileImg = (param) =>
    imgClient.post('profile/user/save-img', param);

export const getFullUserInfo = () =>
    client.get('profile/user');


// todo to 찬민 비밀번호준 알고 놀랐습니다. post 요청간은 경우 뒤쪽에 status 붙여주세요. 햇갈립니다
export const postUserPW = (param) =>
    client.post('profile/user/save-pwd', param);

export const postBoardRentals = (param) =>
    client.post('profile/rentals', param);

export const putBoardRentalsReturn = (param) =>
    client.put('rentals/return', param);


export const postBoardReservations = (param) =>
    client.post('profile/reservations', param);

export const postBoardLikes = (param) =>
    client.post('profile/likes', param);

export const deleteBoardLikes = (param) =>
    client.put('likes/delete', param)


export const getUserNotifications = () =>
    client.get('notifications');

export const postUserNotifications = (param) =>
    client.post('notifications/update',param);

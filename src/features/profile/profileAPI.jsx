import imgClient, {imgClientPost} from "../../api/imgClient.jsx";
import client from "../../api/client.jsx";

export const getUserProfileImg = () =>
    imgClient.get('profile/user/img');

export const postUserProfileImg = (param) =>
    imgClientPost.post('profile/user/save-img', param);

export const getFullUserInfo = () =>
    client.get('profile/user');

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

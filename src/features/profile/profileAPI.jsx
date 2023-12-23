import imgClient, { imgClientPost } from "../../api/imgClient.jsx";

export const getUserProfileImg = () =>
    imgClient.get('/profile/user/img');

export const postUserProfileImg = (param) => {
    imgClientPost.post('/profile/user/save-img', param);
    console.log('param', param)
}




export const imgTest = (param) =>
    imgClientPost.post('/test', param);

import store from "/src/app/store.jsx";
import { jwtDecode } from "jwt-decode";
import {userAction} from "../../../features/accounts/userReducer.jsx";
import {getCookie} from "../../../app/cookie.jsx";



const jwtDecodeHandler = (data) => {
  let result = null;
  if (data) {
    const token = jwtDecode(data.access);
    result = {
      ...data,
      id: token.id,
      isActive: token.isActive,
      isAdmin: token.isAdmin,
      username: token.username,
      name: token.name,
      email: token.email,
      groups: data.groups,
    };
  }

  return result;
};


export const setUserHandler = () => {
  try {
    const userToken = getCookie('tk')  // 쿠키에서 가져오지
    if (!userToken) return;

    store.dispatch(userAction.setUser(jwtDecodeHandler(userToken)));

  } catch (e) {
    console.error("User Setting Exception : ", e);
  }
};

import { store } from "index";
import { userAction } from "features/accounts/userReducer";
import { Modal } from "antd";
import jwt_decode from "jwt-decode";
import { reducerUtils } from "utils/asyncUtils";

/**
 * 로그인
 * @param email 회원의 ID
 * @param password 회원의 비밀번호
 * @returns {{destroy: () => void; update: (configUpdate: ConfigUpdate) => void}}
 */
export const loginHandler = (username, password) => {
  try {
    if (username && password) {
      store.dispatch(
        userAction.login({
          username: username,
          password: password,
        })
      );
    } else {
      return Modal.error({
        title: "로그인 실패",
        content: "ID 또는 Password를 입력해주세요.",
        okText: "확인",
      });
    }
  } catch (e) {
    console.error("Login Exception : ", e);
  }
};

/**
 * 로그아웃
 */
export const logoutHandler = () => {
  try {
    let user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      let refresh_token = user.refresh;
      if (refresh_token) {
        store.dispatch(userAction.logout({ refresh_token: refresh_token }));
        // localStorage.removeItem("user");
      }
    }
  } catch (e) {
    console.error("Logout Exception : ", e);
  }
};

/**
 * 화면 첫 Rendering 될때 user 정보 setting
 */
export const setUserHandler = () => {
  try {
    const userToken = JSON.parse(localStorage.getItem("user"));
    if (!userToken) return;

    store.dispatch(userAction.setUser(jwtDecodeHandler(userToken)));
  } catch (e) {
    console.error("User Setting Exception : ", e);
  }
};

/**
 * 회원 JWT 정보 DECODING
 * @param data
 */
export const jwtDecodeHandler = (data) => {
  let result = null;
  if (data) {
    const token = jwt_decode(data.access);
    result = {
      ...data,
      id: token.id,
      isActive: token.isActive,
      isAdmin: token.isAdmin,
      username: token.username,
      name: token.name,
      email: token.email,
      isChangePwd : token.isChangePwd,
      groups: data.groups,
    };
  }

  return result;
};

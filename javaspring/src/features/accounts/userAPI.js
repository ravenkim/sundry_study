import client from "api/client";
import axios from "axios";

//iris 로그인
export const iris_login_info = (username, password) => {
  const url = "/accounts/iris/login/";

  let result = client.post(
    url,
    "username=" + username + "&" + "password=" + password,
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      // body: {username, password},
      withCredentials: true,
    }
  );
  return result;
};

//인증번호 발급 요청
export const iris_issue_autc = (username) => {
  const url = "/accounts/iris/issue_autc/";
  return client.post(url, "username=" + username, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    // body: { username},
    withCredentials: true,
  });
};

//인증번호 확인
export const iris_validation_autc = (username, autc_no, password) => {
  const url = "/accounts/iris/validation_autc/";
  return client.post(
    url,
    "username=" +
      username +
      "&" +
      "autc_no=" +
      autc_no +
      "&" +
      "password=" +
      password,
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      // body: { username, autc_no},
      withCredentials: true,
    }
  );
};

//SSO로그인
export const iris_sso_login = (ssoId) => {
  const url = "/accounts/iris/sso_login/";
  return client.post(url, "sso_id=" + ssoId, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    // body: { username, autc_no},
    withCredentials: true,
  });
};

// 로그인
export const login = ({ username, password }) => {
  const url = "/accounts/login/";
  return client.post(
    url,
    { username, password },
    {
      headers: {
        "Content-Type": "application/json",
      },
      body: { username, password },
      withCredentials: true,
    }
  );
};

export const logout = ({ refresh_token }) =>
  client.post("/accounts/logout/", { refresh_token });

// JWT 갱신(유효시간 내)
export const loginTokenReset = ({ token }) => {
  const url = "/accounts/token/refresh";
  return client.post(
    url,
    { token },
    {
      headers: {
        "Content-Type": "application/json",
      },
      body: { token },
      withCredentials: true,
    }
  );
};

import axios from "axios";
import jwt_decode from "jwt-decode";

const client = axios.create({
  baseURL: process.env.REACT_APP_API_HOST,
  xsrfCookieName: "csrftoken",
  xsrfHeaderName: "X-CSRFToken",
});

// eslint-disable-next-line no-undef

/**
 글로벌 설정 예시 :

 //API 주소를 다른 곳으로 사용함


 //헤더설정
 client.defaults.headers.common['Authorization'] = 'Bearer a1b2c3d4';

 //인터셉터 설정
 intercepter.request 요청될때마다

 axios.intercepter.response.use({
        response => {
            //요청 성공 시 특정 작업 수행
            return response;
        },
        error => {
            //요청 실패시 특정 작업 수행
            return Promise.reject(error);
        }
    })
 */

const Authorization = () => {
  try {
    const token = JSON.parse(localStorage.getItem("user")).access;
    return `Bearer ${token}`;
  } catch (e) {
    return "";
  }
};

client.defaults.headers.common["Authorization"] = Authorization();

// JWT Refresh 및 인증 시간에 따른 자동 로그아웃
client.interceptors.request.use(
  async (config) => {
    let userToken = JSON.parse(localStorage.getItem("user"));
    if (userToken) {
      config.headers.Authorization = `Bearer ${userToken.access}`;

      const token = jwt_decode(userToken.access);

      // token 만료시간
      if (token.exp < Date.now() / 1000) {
        localStorage.removeItem("user");
        window.location = "/";
      }
    }

    // if (localStorage.getItem("user")) {
    //   token = JSON.parse(localStorage.getItem("user"));
    //
    //   const isActive = jwt_decode(token).is_active;
    //   if (!isActive) {
    //     localStorage.removeItem("user");
    //     localStorage.removeItem("keywords");
    //     window.location = "/";
    //   }
    //
    //   const expireTime = (jwt_decode(token).exp - Date.now() / 1000) / 60; // 분단위
    //   // 만약 현재 토큰의 유효기간이 만료됐다면 localStorage를 지우고 로그인화면으로 이동시킨다.
    //   if (expireTime <= 0) {
    //     localStorage.removeItem("user");
    //     localStorage.removeItem("keywords");
    //     window.location = "/account/login/?m=timeout";
    //   }
    //   // 현재 토큰 유효시간 60분이며 만일 가지고 있는 토큰의 만료시간이 10분 이하이며 유효한 토큰일 경우
    //   // 토큰 재발급을 하도록 함.
    //   else if (expireTime < 10) {
    //     const response = await axios.post(
    //       `${API_URL}/accounts/api-jwt-auth/refresh`,
    //       { token },
    //       {
    //         headers: {},
    //         body: { token },
    //       }
    //     );
    //
    //     const isActive = jwt_decode(response.data.token).is_active;
    //     if (!isActive) {
    //       localStorage.removeItem("user");
    //       localStorage.removeItem("keywords");
    //       window.location = "/";
    //     }
    //     localStorage.setItem("user", JSON.stringify(response.data.token));
    //     store.dispatch(tempSetUser(response.data));
    //     token = response.data.token;
    //   }
    //   // 만약 현재 토큰이 유효기간 보다 많이 남았다면 기존 토큰을 사용한다.
    //   else {
    //     token = JSON.parse(localStorage.getItem("user"));
    //   }
    //
    //   config.headers.Authorization = `Bearer ${token}`;
    // }

    // 로컬스토리지에 user가 있지 않다면 빈 String을 포함하여 보내게 된다.
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

export default client;

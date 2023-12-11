import Cookies from 'react-cookie';

const cookies = new Cookies();

/** Key, Value를 받아 Cookie 생성 후 저장
 * @param {string} name
 * @param {string} value
 */
export const setCookie = (name, value) => {
  //   쿠키 1시간 저장
  return cookies.set(name, value, { maxAge: 60 * 60 , path: '/' });
}

/** Key를 받아 Value를 반환
 * @param {string} name
 * @returns {string}
 */
export const getCookie = (name) => {
  return cookies.get(name);
}

/** Key를 받아 쿠키를 삭제
 * @param {string} name
 */
export const removeCookie = (name) => {
  return cookies.remove(name);
}

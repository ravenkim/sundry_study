import { Cookies } from 'react-cookie'

const cookies = new Cookies()

/*option
path: 쿠키가 유효한 경로를 지정합니다. 기본값은 /.
expires: 쿠키의 만료 시간을 Date 객체로 지정합니다.
maxAge: 쿠키가 몇 초 후 만료될지를 설정합니다.
domain: 쿠키가 유효한 도메인을 설정합니다.
secure: true로 설정하면 HTTPS 연결에서만 쿠키가 전송됩니다.
httpOnly: true로 설정하면 클라이언트 측 JavaScript에서 쿠키에 접근할 수 없습니다.
sameSite: Strict, Lax, 또는 None 값을 설정할 수 있습니다.
* */

export const setCookie = (name, value, option) => {
    return cookies.set(name, value, { ...option })
}

export const getCookie = (name) => {
    return cookies.get(name)
}

export const removeCookie = (name) => {
    return cookies.remove(name)
}
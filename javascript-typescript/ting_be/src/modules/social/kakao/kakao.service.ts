import { Injectable } from '@nestjs/common'
// import axios from 'axios'

@Injectable()
export class KakaoService {
    /**
     * Kakao Redirect를 처리합니다.
     * 받은 인가 코드로 액세스 토큰을 발급받고, 사용자 정보를 조회하여
     * 회원가입 및 계정 연동 처리를 수행한 후 JWT 토큰과 사용자 정보를 반환합니다.
     *
     * @param code - Kakao Authorization code
     * @returns {Promise<{ token: string, user: any }>}
     */
    // async handleKakaoRedirect(code: string) {
    //     const token = await this.getAccessToken(code)
    //     const userInfo = await this.getUserInfo(token)
    //
    //     // 회원가입 여부 확인 및 처리
    //     // 계정 연동 여부 확인 및 처리
    //     // JWT 토큰 생성 및 반환
    //
    //     return {
    //         token: 'generated-jwt-token', // 실제 생성된 JWT 토큰
    //         user: userInfo,
    //     }
    //
    //
    //
    // }
    /**
     * Kakao로부터 액세스 토큰을 발급받습니다.
     *
     * @param code - Kakao Authorization code
     * @returns {Promise<string>} - Access token
     */
    // async getAccessToken(code: string): Promise<string> {
    //     const response = await axios.post(
    //         'https://kauth.kakao.com/oauth/token',
    //         null,
    //         {
    //             params: {
    //                 grant_type: 'authorization_code',
    //                 client_id: 'YOUR_CLIENT_ID',
    //                 redirect_uri: 'YOUR_REDIRECT_URI',
    //                 code,
    //             },
    //         },
    //     )
    //     return response.data.access_token
    // }
    /**
     * 발급받은 액세스 토큰으로 Kakao 사용자 정보를 조회합니다.
     *
     * @param token - Access token
     * @returns {Promise<any>} - User information
     */
    // async getUserInfo(token: string): Promise<any> {
    //     const response = await axios.get('https://kapi.kakao.com/v2/user/me', {
    //         headers: {
    //             Authorization: `Bearer ${token}`,
    //         },
    //     })
    //     return response.data
    // }
}

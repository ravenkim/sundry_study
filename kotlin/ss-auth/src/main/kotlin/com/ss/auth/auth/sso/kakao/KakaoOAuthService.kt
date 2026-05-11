package com.ss.auth.auth.sso.kakao

import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest
import org.springframework.security.oauth2.core.OAuth2AuthenticationException
import org.springframework.security.oauth2.core.user.OAuth2User
import org.springframework.stereotype.Service

@Service
class KakaoOAuthService : DefaultOAuth2UserService() {

    @Throws(OAuth2AuthenticationException::class)
    override fun loadUser(userRequest: OAuth2UserRequest): OAuth2User {
        val oAuth2User = super.loadUser(userRequest)

        // 카카오 사용자 정보 처리 로직
        println("Kakao OAuth2 User Attributes: ${oAuth2User.attributes}")
        println("Client Registration Id: ${userRequest.clientRegistration.registrationId}")

        // TODO: 카카오 사용자 정보를 데이터베이스에 저장/업데이트
        // TODO: 2FA 로직 통합 (필요시)

        return oAuth2User
    }
}

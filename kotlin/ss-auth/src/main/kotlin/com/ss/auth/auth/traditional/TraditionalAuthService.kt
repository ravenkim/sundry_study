package com.ss.auth.auth.traditional

import org.springframework.security.core.userdetails.User
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.security.provisioning.InMemoryUserDetailsManager
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest
import org.springframework.security.oauth2.core.OAuth2AuthenticationException
import org.springframework.security.oauth2.core.user.OAuth2User
import org.springframework.stereotype.Service

@Service
class TraditionalAuthService : UserDetailsService, DefaultOAuth2UserService() {

    private val userDetailsManager = InMemoryUserDetailsManager(
        User.withUsername("user")
            .password(passwordEncoder().encode("password"))
            .roles("USER")
            .build()
    )

    override fun loadUserByUsername(username: String): UserDetails {
        return userDetailsManager.loadUserByUsername(username)
    }

    @Throws(OAuth2AuthenticationException::class)
    override fun loadUser(userRequest: OAuth2UserRequest): OAuth2User {
        val oAuth2User = super.loadUser(userRequest)

        // OAuth2 사용자 정보 처리 로직
        println("OAuth2 User Attributes: ${oAuth2User.attributes}")
        println("Client Registration Id: ${userRequest.clientRegistration.registrationId}")

        // TODO: OAuth2 사용자 정보를 데이터베이스에 저장/업데이트
        // TODO: 2FA 로직 통합 (필요시)

        return oAuth2User
    }

    private fun passwordEncoder(): PasswordEncoder {
        return BCryptPasswordEncoder()
    }
}

package com.ss.auth.config.oauth

import com.ss.auth.jwt.JwtProvider
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.springframework.security.core.Authentication
import org.springframework.security.core.userdetails.User
import org.springframework.security.web.authentication.AuthenticationSuccessHandler
import org.springframework.stereotype.Component

@Component
class OAuth2AuthenticationSuccessHandler(
    private val jwtProvider: JwtProvider
) : AuthenticationSuccessHandler {

    override fun onAuthenticationSuccess(
        request: HttpServletRequest,
        response: HttpServletResponse,
        authentication: Authentication
    ) {
        // In a real application, you would get the UserDetails from your user service
        // based on the OAuth2User information. For simplicity, we'll create a dummy UserDetails.
        val userDetails = User.withUsername(authentication.name)
            .password("") // Password is not relevant for OAuth2 success
            .roles("USER")
            .build()

        val jwt = jwtProvider.generateToken(userDetails)
        response.contentType = "application/json"
        response.writer.write("{\"jwt\": \"$jwt\"}")
        response.writer.flush()
    }
}

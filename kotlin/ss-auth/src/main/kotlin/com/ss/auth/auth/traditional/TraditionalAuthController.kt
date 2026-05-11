package com.ss.auth.auth.traditional

import com.ss.auth.jwt.JwtProvider
import com.ss.auth.model.LoginRequest
import org.springframework.security.authentication.AuthenticationManager
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/auth/traditional")
class TraditionalAuthController(
    private val authenticationManager: AuthenticationManager,
    private val jwtProvider: JwtProvider
) {

    @PostMapping("/login")
    fun login(@RequestBody loginRequest: LoginRequest): Map<String, String> {
        val authentication = authenticationManager.authenticate(
            UsernamePasswordAuthenticationToken(loginRequest.username, loginRequest.password)
        )
        val userDetails = authentication.principal as UserDetails
        val jwt = jwtProvider.generateToken(userDetails)
        return mapOf("jwt" to jwt)
    }
}

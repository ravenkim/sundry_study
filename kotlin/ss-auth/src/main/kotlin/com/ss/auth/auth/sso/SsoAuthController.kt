package com.ss.auth.auth.sso

import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.security.oauth2.jwt.Jwt
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/auth/sso")
class SsoAuthController {

    @GetMapping("/me")
    fun me(@AuthenticationPrincipal jwt: Jwt): Map<String, Any> {
        return jwt.claims
    }

    @GetMapping("/status")
    fun status(): Map<String, String> {
        return mapOf("status" to "SSO authentication service is running")
    }
}

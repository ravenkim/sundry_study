package com.ss.auth.controller

import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api")
class AuthController {

    @GetMapping("/health")
    fun health(): Map<String, String> {
        return mapOf("status" to "Authentication service is running")
    }

    @GetMapping("/info")
    fun info(): Map<String, String> {
        return mapOf(
            "service" to "SS Authentication Service",
            "version" to "1.0.0",
            "type" to "API Server"
        )
    }
}

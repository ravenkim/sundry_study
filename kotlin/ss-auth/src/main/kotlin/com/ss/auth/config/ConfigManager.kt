package com.ss.auth.config

import com.ss.auth.config.security.SecurityConfig
import com.ss.auth.config.oauth.AuthorizationServerConfig
import com.ss.auth.config.oauth.RegisteredClientConfig
import org.springframework.context.annotation.Configuration
import org.springframework.context.annotation.Import

@Configuration
@Import(
    SecurityConfig::class,
    AuthorizationServerConfig::class,
    RegisteredClientConfig::class
)
class ConfigManager {
    // 모든 설정 클래스들을 여기서 관리
}

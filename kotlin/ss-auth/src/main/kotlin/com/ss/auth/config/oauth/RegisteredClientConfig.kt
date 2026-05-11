package com.ss.auth.config.oauth

import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.security.oauth2.core.AuthorizationGrantType
import org.springframework.security.oauth2.core.ClientAuthenticationMethod
import org.springframework.security.oauth2.core.oidc.OidcScopes
import org.springframework.security.oauth2.server.authorization.client.InMemoryRegisteredClientRepository
import org.springframework.security.oauth2.server.authorization.client.RegisteredClient
import org.springframework.security.oauth2.server.authorization.client.RegisteredClientRepository
import org.springframework.security.oauth2.server.authorization.settings.ClientSettings
import java.util.*

@Configuration
open class RegisteredClientConfig {

    @Bean
    open fun registeredClientRepository(): RegisteredClientRepository {
        val registeredClient = RegisteredClient.withId(UUID.randomUUID().toString())
            .clientId("api-client")
            .clientSecret("{noop}secret")
            .clientAuthenticationMethod(ClientAuthenticationMethod.CLIENT_SECRET_BASIC)
            .authorizationGrantType(AuthorizationGrantType.AUTHORIZATION_CODE)
            .authorizationGrantType(AuthorizationGrantType.REFRESH_TOKEN)
            .authorizationGrantType(AuthorizationGrantType.CLIENT_CREDENTIALS)
            .redirectUri("http://127.0.0.1:8080/login/oauth2/code/api-client-oidc")
            .redirectUri("http://127.0.0.1:8080/authorized")
            .scope(OidcScopes.OPENID)
            .scope(OidcScopes.PROFILE)
            .scope("api.read")
            .clientSettings(ClientSettings.builder().requireAuthorizationConsent(true).build())
            .build()
        return InMemoryRegisteredClientRepository(registeredClient)
    }
}

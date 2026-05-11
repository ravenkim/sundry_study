package com.ss.auth.config.swagger

import io.swagger.v3.oas.models.OpenAPI
import io.swagger.v3.oas.models.info.Info
import io.swagger.v3.oas.models.info.Contact
import io.swagger.v3.oas.models.servers.Server
import org.springframework.beans.factory.annotation.Value
import org.springframework.boot.context.event.ApplicationReadyEvent
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.context.event.EventListener
import org.springframework.core.env.Environment

@Configuration
open class SwaggerConfig(
    private val environment: Environment
) {

    @Bean
    open fun openAPI(): OpenAPI {
        return OpenAPI()
            .info(
                Info()
                    .title("SS Authentication Service API")
                    .description("SSO 및 일반 로그인을 지원하는 인증 서비스 API")
                    .version("1.0.0")
                    .contact(
                        Contact()
                            .name("SS Team")
                            .email("support@ss.com")
                    )
            )
            .addServersItem(
                Server()
                    .url("http://localhost:8080")
                    .description("Local Development Server")
            )
    }


}

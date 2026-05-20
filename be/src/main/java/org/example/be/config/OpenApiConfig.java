package org.example.be.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI ecoReportOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("EcoReport API")
                        .description("캠퍼스 빈 강의실 에너지 낭비 제보 플랫폼 API")
                        .version("v1.0.0")
                        .contact(new Contact()
                                .name("EcoReport Team")))
                .servers(List.of(
                        new Server().url("http://localhost:8080").description("Local"),
                        new Server().url("/").description("Current host")));
    }
}

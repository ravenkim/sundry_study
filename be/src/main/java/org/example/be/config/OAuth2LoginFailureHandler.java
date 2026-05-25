package org.example.be.config;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.nio.charset.StandardCharsets;

@Component
@Slf4j
public class OAuth2LoginFailureHandler implements AuthenticationFailureHandler {

    @Value("${app.frontend.url:http://localhost:5173}")
    private String frontendUrl;

    @Override
    public void onAuthenticationFailure(
            HttpServletRequest request,
            HttpServletResponse response,
            AuthenticationException exception
    ) throws IOException {
        log.warn("OAuth2 login failed: {}", exception.getMessage(), exception);
        String base = frontendUrl.endsWith("/")
                ? frontendUrl.substring(0, frontendUrl.length() - 1)
                : frontendUrl;
        String url = UriComponentsBuilder
                .fromUriString(base + "/login")
                .queryParam("error", "oauth")
                .encode(StandardCharsets.UTF_8)
                .build()
                .toUriString();
        response.sendRedirect(url);
    }
}

package org.example.be.config;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.be.service.auth.OAuthAttributesHelper;
import org.example.be.service.auth.OAuthLoginCompletionService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.nio.charset.StandardCharsets;

@Component
@RequiredArgsConstructor
@Slf4j
public class OAuth2LoginSuccessHandler implements AuthenticationSuccessHandler {

    private final OAuthLoginCompletionService oauthLoginCompletionService;

    @Value("${app.frontend.url:http://localhost:5173}")
    private String frontendUrl;

    @Override
    public void onAuthenticationSuccess(
            HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication
    ) throws IOException {
        try {
            if (!(authentication instanceof OAuth2AuthenticationToken oauthToken)) {
                log.warn("OAuth2 success handler received unexpected authentication type: {}",
                        authentication.getClass().getName());
                redirectWithError(response);
                return;
            }

            String provider = oauthToken.getAuthorizedClientRegistrationId();
            OAuth2User principal = oauthToken.getPrincipal();
            OAuthAttributesHelper.OAuthUserProfile profile =
                    OAuthAttributesHelper.extract(provider, principal.getAttributes());

            if (profile.email() == null || profile.email().isBlank()) {
                log.warn("OAuth2 success handler missing email for provider={}", provider);
                redirectWithError(response);
                return;
            }

            String normalizedEmail = profile.email().trim().toLowerCase();
            var loginResult = oauthLoginCompletionService.completeLogin(normalizedEmail);
            if (loginResult.isEmpty()) {
                log.warn("OAuth2 success handler member not found for email={}", normalizedEmail);
                redirectWithError(response);
                return;
            }

            var result = loginResult.get();
            String redirectUrl = UriComponentsBuilder
                    .fromUriString(trimTrailingSlash(frontendUrl) + "/oauth/callback")
                    .queryParam("token", result.accessToken())
                    .queryParam("userName", result.userName())
                    .queryParam("email", result.email())
                    .encode(StandardCharsets.UTF_8)
                    .build()
                    .toUriString();

            response.sendRedirect(redirectUrl);
        } catch (Exception ex) {
            log.error("OAuth2 success handler failed", ex);
            redirectWithError(response);
        }
    }

    private void redirectWithError(HttpServletResponse response) throws IOException {
        String url = UriComponentsBuilder
                .fromUriString(trimTrailingSlash(frontendUrl) + "/login")
                .queryParam("error", "oauth")
                .encode(StandardCharsets.UTF_8)
                .build()
                .toUriString();
        response.sendRedirect(url);
    }

    private static String trimTrailingSlash(String url) {
        if (url == null || url.isBlank()) {
            return "http://localhost:5173";
        }
        return url.endsWith("/") ? url.substring(0, url.length() - 1) : url;
    }
}

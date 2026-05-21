package org.example.be.config;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.example.be.domain.model.Member;
import org.example.be.domain.repository.MemberRepository;
import org.example.be.service.auth.JwtTokenProvider;
import org.example.be.service.auth.OAuthAttributesHelper;
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
public class OAuth2LoginSuccessHandler implements AuthenticationSuccessHandler {

    private final MemberRepository memberRepository;
    private final JwtTokenProvider jwtTokenProvider;

    @Value("${app.frontend.url:http://localhost:5173}")
    private String frontendUrl;

    @Override
    public void onAuthenticationSuccess(
            HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication
    ) throws IOException {
        if (!(authentication instanceof OAuth2AuthenticationToken oauthToken)) {
            redirectWithError(response);
            return;
        }

        String provider = oauthToken.getAuthorizedClientRegistration().getRegistrationId();
        OAuth2User principal = oauthToken.getPrincipal();
        OAuthAttributesHelper.OAuthUserProfile profile =
                OAuthAttributesHelper.extract(provider, principal.getAttributes());

        if (profile.email() == null || profile.email().isBlank()) {
            redirectWithError(response);
            return;
        }

        String normalizedEmail = profile.email().trim().toLowerCase();
        Member member = memberRepository.findByEmailIgnoreCase(normalizedEmail).orElse(null);
        if (member == null) {
            redirectWithError(response);
            return;
        }

        String accessToken = jwtTokenProvider.createToken(member);

        String redirectUrl = UriComponentsBuilder
                .fromUriString(trimTrailingSlash(frontendUrl) + "/oauth/callback")
                .queryParam("token", accessToken)
                .queryParam("userName", member.getUserName())
                .queryParam("email", member.getEmail())
                .encode(StandardCharsets.UTF_8)
                .build()
                .toUriString();

        response.sendRedirect(redirectUrl);
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

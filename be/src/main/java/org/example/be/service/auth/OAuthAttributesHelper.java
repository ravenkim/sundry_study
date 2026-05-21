package org.example.be.service.auth;

import org.springframework.security.oauth2.core.OAuth2AuthenticationException;

import java.util.Map;

public final class OAuthAttributesHelper {

    private OAuthAttributesHelper() {
    }

    public static OAuthUserProfile extract(String provider, Map<String, Object> attributes) {
        if ("google".equals(provider)) {
            return new OAuthUserProfile(
                    (String) attributes.get("email"),
                    (String) attributes.get("name"),
                    (String) attributes.get("sub")
            );
        }
        if ("kakao".equals(provider)) {
            @SuppressWarnings("unchecked")
            Map<String, Object> kakaoAccount = (Map<String, Object>) attributes.get("kakao_account");
            if (kakaoAccount == null) {
                throw new OAuth2AuthenticationException("kakao_account is missing");
            }
            @SuppressWarnings("unchecked")
            Map<String, Object> profile = (Map<String, Object>) kakaoAccount.get("profile");
            if (profile == null) {
                throw new OAuth2AuthenticationException("kakao profile is missing");
            }
            return new OAuthUserProfile(
                    (String) kakaoAccount.get("email"),
                    (String) profile.get("nickname"),
                    String.valueOf(attributes.get("id"))
            );
        }
        throw new OAuth2AuthenticationException("Unsupported OAuth provider: " + provider);
    }

    public record OAuthUserProfile(String email, String name, String providerId) {
    }
}

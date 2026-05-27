package org.example.be.service.auth;

import org.springframework.security.oauth2.core.OAuth2AuthenticationException;

import java.util.Map;

public final class OAuthAttributesHelper {

    private OAuthAttributesHelper() {
    }

    public static OAuthUserProfile extract(String provider, Map<String, Object> attributes) {
        if ("google".equals(provider)) {
            String email = asString(attributes.get("email"));
            String name = asString(attributes.get("name"));
            String sub = asString(attributes.get("sub"));
            if (sub == null || sub.isBlank()) {
                throw new OAuth2AuthenticationException("Google OAuth profile missing sub");
            }
            return new OAuthUserProfile(email, name, sub);
        }
        throw new OAuth2AuthenticationException("Unsupported OAuth provider: " + provider);
    }

    private static String asString(Object value) {
        return value == null ? null : String.valueOf(value);
    }

    public record OAuthUserProfile(String email, String name, String providerId) {
    }
}

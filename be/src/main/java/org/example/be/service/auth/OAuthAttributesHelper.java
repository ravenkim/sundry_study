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
        throw new OAuth2AuthenticationException("Unsupported OAuth provider: " + provider);
    }

    public record OAuthUserProfile(String email, String name, String providerId) {
    }
}

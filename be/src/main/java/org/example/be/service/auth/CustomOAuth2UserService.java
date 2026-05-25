package org.example.be.service.auth;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.be.domain.model.Member;
import org.example.be.domain.model.MemberPoint;
import org.example.be.domain.model.UserType;
import org.example.be.domain.repository.MemberPointRepository;
import org.example.be.domain.repository.MemberRepository;
import org.springframework.dao.DataAccessException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.OAuth2Error;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final MemberRepository memberRepository;
    private final MemberPointRepository memberPointRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        try {
            OAuth2User oAuth2User = super.loadUser(userRequest);

            String provider = userRequest.getClientRegistration().getRegistrationId();
            Map<String, Object> attributes = oAuth2User.getAttributes();

            OAuthAttributesHelper.OAuthUserProfile profile =
                    OAuthAttributesHelper.extract(provider, attributes);
            String email = profile.email();
            String name = profile.name();
            String providerId = profile.providerId();

            if (email == null || email.isBlank()) {
                throw oauthError("Google 계정 이메일 정보를 가져오지 못했습니다.");
            }

            String normalizedEmail = email.trim().toLowerCase();
            Optional<Member> optionalMember = memberRepository.findByEmailIgnoreCase(normalizedEmail);

            if (optionalMember.isEmpty()) {
                Member member = new Member();
                member.setUserName(buildOAuthUserName(name, providerId));
                member.setEmail(normalizedEmail);
                member.setPassword(passwordEncoder.encode(UUID.randomUUID().toString()));
                member.setProvider(provider);
                member.setProviderId(providerId);
                member.setUserType(UserType.USER);

                memberRepository.save(member);
                memberPointRepository.save(new MemberPoint(member));
            } else {
                Member member = optionalMember.get();
                member.setProvider(provider);
                member.setProviderId(providerId);
            }

            return new DefaultOAuth2User(
                    Collections.emptyList(),
                    attributes,
                    "google".equals(provider) ? "sub" : "id"
            );
        } catch (OAuth2AuthenticationException ex) {
            throw ex;
        } catch (DataAccessException ex) {
            log.error("OAuth member persistence failed", ex);
            throw oauthError("회원 정보 저장 중 오류가 발생했습니다.");
        } catch (RuntimeException ex) {
            log.error("OAuth user load failed", ex);
            throw oauthError("Google 로그인 처리 중 오류가 발생했습니다.");
        }
    }

    private static String buildOAuthUserName(String name, String providerId) {
        String safeName = (name == null || name.isBlank())
                ? "user"
                : name.trim().replaceAll("\\s+", "");
        String idSuffix = providerId.length() >= 5
                ? providerId.substring(0, 5)
                : providerId;
        String userName = safeName + "_" + idSuffix;
        return userName.length() > 255 ? userName.substring(0, 255) : userName;
    }

    private static OAuth2AuthenticationException oauthError(String message) {
        return new OAuth2AuthenticationException(new OAuth2Error("invalid_user"), message);
    }
}

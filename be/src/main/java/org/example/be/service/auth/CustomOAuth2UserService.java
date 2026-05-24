package org.example.be.service.auth;

import lombok.RequiredArgsConstructor;
import org.example.be.domain.model.Member;
import org.example.be.domain.model.MemberPoint;
import org.example.be.domain.model.UserType;
import org.example.be.domain.repository.MemberPointRepository;
import org.example.be.domain.repository.MemberRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional; // 추가됨

import java.util.Collections;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional // 영속성 컨텍스트와 트랜잭션 관리를 위해 추가!
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final MemberRepository memberRepository;
    private final MemberPointRepository memberPointRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(userRequest);

        String provider = userRequest.getClientRegistration().getRegistrationId();
        Map<String, Object> attributes = oAuth2User.getAttributes();

        OAuthAttributesHelper.OAuthUserProfile profile =
                OAuthAttributesHelper.extract(provider, attributes);
        String email = profile.email();
        String name = profile.name();
        String providerId = profile.providerId();

        // JPA 영속성 컨텍스트 내에서 동작
        String normalizedEmail = email == null ? "" : email.trim().toLowerCase();
        Optional<Member> optionalMember = memberRepository.findByEmailIgnoreCase(normalizedEmail);
        Member member;

        if (optionalMember.isEmpty()) {
            member = new Member();
            String idSuffix = providerId.length() >= 5 ? providerId.substring(0, 5) : providerId;
            member.setUserName(name + "_" + idSuffix);
            member.setEmail(normalizedEmail);
            member.setPassword(passwordEncoder.encode(UUID.randomUUID().toString()));
            member.setProvider(provider);
            member.setProviderId(providerId);
            member.setUserType(UserType.USER);

            memberRepository.save(member);
            memberPointRepository.save(new MemberPoint(member));
        } else {
            member = optionalMember.get();
            // 기존 유저 정보 업데이트가 필요하다면 여기서 member.setUserName()만 해도
            // Dirty Checking(변경 감지)이 발생하여 save() 없이도 DB가 업데이트 됩니다. (사진의 로직과 동일)
        }

        return new DefaultOAuth2User(
                Collections.emptyList(),
                attributes,
                "google".equals(provider) ? "sub" : "id"
        );
    }
}
package org.example.be.service.auth;

import lombok.RequiredArgsConstructor;
import org.example.be.domain.model.Member;
import org.example.be.domain.repository.MemberRepository;
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

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(userRequest);

        String provider = userRequest.getClientRegistration().getRegistrationId();
        Map<String, Object> attributes = oAuth2User.getAttributes();

        String email = "";
        String name = "";
        String providerId = "";

        if ("google".equals(provider)) {
            email = (String) attributes.get("email");
            name = (String) attributes.get("name");
            providerId = (String) attributes.get("sub");
        } else if ("kakao".equals(provider)) {
            Map<String, Object> kakaoAccount = (Map<String, Object>) attributes.get("kakao_account");
            Map<String, Object> profile = (Map<String, Object>) kakaoAccount.get("profile");
            email = (String) kakaoAccount.get("email");
            name = (String) profile.get("nickname");
            providerId = String.valueOf(attributes.get("id"));
        }

        // JPA 영속성 컨텍스트 내에서 동작
        Optional<Member> optionalMember = memberRepository.findByEmail(email);
        Member member;

        if (optionalMember.isEmpty()) {
            member = new Member();
            member.setUserName(name + "_" + providerId.substring(0, 5));
            member.setEmail(email);
            member.setPassword(UUID.randomUUID().toString());
            member.setProvider(provider);
            member.setProviderId(providerId);

            // save() 내부에서 em.persist()가 호출되어 영속성 컨텍스트에 관리됨
            memberRepository.save(member);
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
package org.example.be.service.auth;

import lombok.RequiredArgsConstructor;
import org.example.be.domain.model.Member;
import org.example.be.domain.repository.MemberRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class OAuthLoginCompletionService {

    private final MemberRepository memberRepository;
    private final JwtTokenProvider jwtTokenProvider;

    public record OAuthLoginResult(String accessToken, String userName, String email) {
    }

    @Transactional(readOnly = true)
    public Optional<OAuthLoginResult> completeLogin(String normalizedEmail) {
        return memberRepository.findByEmailIgnoreCase(normalizedEmail)
                .map(this::toLoginResult);
    }

    private OAuthLoginResult toLoginResult(Member member) {
        return new OAuthLoginResult(
                jwtTokenProvider.createToken(member),
                member.getUserName(),
                member.getEmail()
        );
    }
}

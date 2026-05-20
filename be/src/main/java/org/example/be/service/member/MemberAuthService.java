package org.example.be.service.member;

import lombok.RequiredArgsConstructor;
import org.example.be.api.request.MemberRequest;
import org.example.be.domain.model.Member;
import org.example.be.domain.repository.MemberRepository;
import org.example.be.exception.BusinessLogicException;
import org.example.be.exception.ErrorCode;
import org.example.be.service.auth.AuthService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
@RequiredArgsConstructor
public class MemberAuthService implements AuthService {

    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public boolean login(MemberRequest.Login request) {
        // JPA 레포지토리 사용 (QueryDSL 제거)
        Member member = memberRepository.findByUserName(request.getUserName())
                .orElseThrow(() -> new BusinessLogicException(ErrorCode.NOT_FOUND, "Member not found"));

        return passwordEncoder.matches(request.getPassword(), member.getPassword());
    }
}
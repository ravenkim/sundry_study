package org.example.be.service.auth;

import lombok.RequiredArgsConstructor;
import org.example.be.api.request.MemberRequest;
import org.example.be.domain.model.Member;
import org.example.be.domain.repository.MemberRepository;
import org.example.be.exception.BusinessLogicException;
import org.example.be.exception.ErrorCode;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true) // 읽기 전용 영속성 관리 (성능 최적화)
@RequiredArgsConstructor
public class MemberAuthService implements AuthService {

    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public boolean login(MemberRequest.Login request) {
        // 영속성 컨텍스트 1차 캐시로 불러옴 (수정할 목적이 아니므로 읽기 전용으로 가볍게)
        Member member = memberRepository.findByUserName(request.getUserName())
                .orElseThrow(() -> new BusinessLogicException(ErrorCode.NOT_FOUND, "Member not found"));

        return passwordEncoder.matches(request.getPassword(), member.getPassword());
    }
}
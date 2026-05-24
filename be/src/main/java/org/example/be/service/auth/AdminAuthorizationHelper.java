package org.example.be.service.auth;

import lombok.RequiredArgsConstructor;
import org.example.be.domain.model.Member;
import org.example.be.domain.model.UserType;
import org.example.be.domain.repository.MemberRepository;
import org.example.be.exception.BusinessLogicException;
import org.example.be.exception.ErrorCode;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class AdminAuthorizationHelper {

    private final MemberRepository memberRepository;

    public Member requireAdmin(Long memberSeq) {
        Member member = memberRepository.findById(memberSeq)
                .orElseThrow(() -> new BusinessLogicException(ErrorCode.NOT_FOUND, "회원을 찾을 수 없습니다."));

        if (member.getUserType() != UserType.ADMIN) {
            throw new BusinessLogicException(ErrorCode.NO_PERMISSION, "관리자만 접근할 수 있습니다.");
        }

        return member;
    }
}

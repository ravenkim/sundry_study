package org.example.be.service.member;

import lombok.RequiredArgsConstructor;
import org.example.be.api.request.MemberRequest;
import org.example.be.api.response.MemberResponse;
import org.example.be.domain.model.Member;
import org.example.be.domain.repository.MemberRepository;
import org.example.be.exception.BusinessLogicException;
import org.example.be.exception.ErrorCode;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true) // 기본적으로 읽기 전용으로 영속성 관리
@RequiredArgsConstructor
public class DefaultMemberService implements MemberService {

    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional // 데이터를 삽입/수정하는 메서드만 트랜잭션 활성화 (em.persist 실행)
    @Override
    public boolean registerMember(MemberRequest.Create request) {
        if (request.getPassword() == null || request.getPassword().length() < 8) {
            throw new BusinessLogicException(ErrorCode.INVALID, "Password must be at least 8 characters long");
        }

        if (memberRepository.findByUserName(request.getUserName()).isPresent()) {
            throw new BusinessLogicException(ErrorCode.ALREADY_EXISTS, "Member ID already exists");
        }

        Member member = new Member(
                request.getUserName(),
                passwordEncoder.encode(request.getPassword()),
                request.getEmail()
        );
        memberRepository.save(member); // 영속성 컨텍스트에 등록 (em.persist와 동일 역할)

        return true;
    }

    // 조회 로직이므로 클래스 레벨의 readOnly=true를 탐
    @Override
    public MemberResponse.Detail findMemberById(String userName) {
        Member member = memberRepository.findByUserName(userName)
                .orElseThrow(() -> new BusinessLogicException(ErrorCode.NOT_FOUND, "Member not found"));

        return null;
    }

    /* 💡 영속성 컨텍스트의 꽃 "변경 감지(Dirty Checking)" 예시입니다. 💡
    @Transactional
    public void updateEmail(String userName, String newEmail) {
        // 1. 영속성 컨텍스트로 객체 불러오기
        Member member = memberRepository.findByUserName(userName).orElseThrow(...);

        // 2. 값 변경하기 (사진의 member.setUsername("변경") 과 동일한 동작)
        member.setEmail(newEmail);

        // 3. 🚨 memberRepository.save(member); 가 필요 없습니다! 🚨
        // @Transactional이 끝나는 시점에 영속성 컨텍스트가 변경을 감지하고 자동으로 UPDATE 쿼리를 날려줍니다.
    }
    */
}
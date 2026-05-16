package org.example.be.service;

import org.example.be.api.request.MemberRequest;
import org.example.be.domain.model.Member;
import org.example.be.exception.BusinessLogicException;
import org.example.be.exception.ErrorCode;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@Transactional
public class MemberAuthService implements AuthService {

    private EntityManager entityManager;
    //private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @Override
    public boolean login(MemberRequest.Login request) {
        /*QMember qMember = QMember.member;

        JPAQuery<Member> query = new JPAQuery<>(entityManager);
        Optional<Member> memberOptional = Optional.ofNullable(query
                .from(qMember)
                .where(qMember.userName.eq(request.getUserName()))
                .select(qMember)
                .fetchOne());

        Member member = memberOptional.orElseThrow(() -> new BusinessLogicException(ErrorCode.NOT_FOUND, "Member not found"));

        return passwordEncoder.matches(request.getPassword(), member.getPassword());*/
        return true;
    }


}

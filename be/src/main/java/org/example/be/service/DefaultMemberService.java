package org.example.be.service;

import org.example.be.api.request.MemberRequest;
import org.example.be.api.response.MemberResponse;
import org.example.be.domain.model.Member;
//import org.example.be.domain.model.QMember;
import org.example.be.domain.repository.MemberRepository;
import org.example.be.exception.BusinessLogicException;
import org.example.be.exception.ErrorCode;
//import com.querydsl.jpa.impl.JPAQuery;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
//import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;


@Service
@Transactional
public class DefaultMemberService implements MemberService {
    @Autowired
    private EntityManager entityManager;

    @Autowired
    private MemberRepository memberRepository;

    //private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @Override
    public boolean registerMember(MemberRequest.Create request) {
        /*// Validate password strength (example)
        if (request.getPassword() == null || request.getPassword().length() < 8) {
            throw new BusinessLogicException(ErrorCode.INVALID, "Password must be at least 8 characters long");
        }

        QMember qMember = QMember.member;

        JPAQuery<Member> query = new JPAQuery<>(entityManager);
        Optional<Member> memberOptional = Optional.ofNullable(query
                .from(qMember)
                .where(qMember.userName.eq(request.getUserName()))
                .select(qMember)
                .fetchOne());

        if (memberOptional.isPresent()) {
            throw new BusinessLogicException(ErrorCode.ALREADY_EXISTS, "Member ID already exists");
        }

        Member member = new Member(request.getUserName(),
                passwordEncoder.encode(request.getPassword()),
                request.getEmail());
        memberRepository.save(member);
        */
        return true;
    }

    @Override
    public MemberResponse.Detail findMemberById(String userName) {
        /*
        QMember qMember = QMember.member;

        JPAQuery<Member> query = new JPAQuery<>(entityManager);
        Optional<Member> memberOptional = Optional.ofNullable(query
                .from(qMember)
                .where(qMember.userName.eq(userName))
                .select(qMember)
                .fetchOne());

        Member member = memberOptional.orElseThrow(() -> new BusinessLogicException(ErrorCode.NOT_FOUND, "Member not found"));
        */
        return null;    //MemberResponse.Detail.of(member);
    }
}

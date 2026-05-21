package org.example.be.domain.repository;

import org.example.be.domain.model.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface MemberRepository extends JpaRepository<Member, Long> {
    // QueryDSL을 대체할 Spring Data JPA 쿼리 메서드
    Optional<Member> findByUserName(String userName);
    Optional<Member> findByEmail(String email);

    Optional<Member> findByEmailIgnoreCase(String email);
}
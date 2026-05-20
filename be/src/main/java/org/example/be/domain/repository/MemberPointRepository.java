package org.example.be.domain.repository;

import org.example.be.domain.model.MemberPoint;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface MemberPointRepository extends JpaRepository<MemberPoint, Long> {
    Optional<MemberPoint> findByMemberSeq(Long memberSeq);
}
package org.example.be.domain.repository;

import org.example.be.domain.model.GifticonExchange;
import org.example.be.domain.model.GifticonExchangeStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface GifticonExchangeRepository extends JpaRepository<GifticonExchange, Long> {

    List<GifticonExchange> findByMember_SeqOrderByCreatedAtDesc(Long memberSeq);

    List<GifticonExchange> findAllByOrderByCreatedAtDesc();

    List<GifticonExchange> findByStatusOrderByCreatedAtDesc(GifticonExchangeStatus status);

    @Query("""
            SELECT COALESCE(SUM(e.pointUsed), 0)
            FROM GifticonExchange e
            WHERE e.member.seq = :memberSeq
              AND e.status <> org.example.be.domain.model.GifticonExchangeStatus.REJECTED
            """)
    int sumRedeemedPointsByMember(@Param("memberSeq") Long memberSeq);

    long countByStatus(GifticonExchangeStatus status);

    @Query("""
            SELECT COALESCE(SUM(e.pointUsed), 0)
            FROM GifticonExchange e
            WHERE e.status = org.example.be.domain.model.GifticonExchangeStatus.PENDING
            """)
    int sumPendingPoints();
}

package org.example.be.domain.repository;

import org.example.be.domain.model.Report;
import org.example.be.domain.model.ReportStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface ReportRepository extends JpaRepository<Report, Long> {

    Page<Report> findByMember_SeqOrderByCreatedAtDesc(Long memberSeq, Pageable pageable);

    Page<Report> findByMember_SeqAndStatusOrderByCreatedAtDesc(
            Long memberSeq, ReportStatus status, Pageable pageable);

    Optional<Report> findBySeqAndMember_Seq(Long seq, Long memberSeq);

    boolean existsByLocationNode_Seq(Long locationSeq);

    boolean existsByMember_SeqAndLocationNode_Seq(Long memberSeq, Long locationSeq);

    List<Report> findByMember_SeqAndStatusInAndEstimatedKwhIsNotNull(
            Long memberSeq,
            List<ReportStatus> statuses
    );

    @EntityGraph(attributePaths = {"member", "locationNode"})
    List<Report> findAllByOrderByCreatedAtDesc();

    long countByCreatedAtBetween(LocalDateTime start, LocalDateTime end);

    long countByCreatedAtBetweenAndStatus(
            LocalDateTime start,
            LocalDateTime end,
            ReportStatus status
    );

    long countByStatus(ReportStatus status);

    @Query(value = """
            SELECT m.seq AS memberSeq,
                   m.nickname AS nickname,
                   COUNT(r.seq) AS reportCount,
                   COALESCE(SUM(r.estimated_kwh), 0) AS totalKwh,
                   COALESCE(SUM(r.point_awarded), 0) AS pointAwarded
            FROM member_db m
            LEFT JOIN report_db r ON r.member_seq = m.seq
                AND r.status IN ('PENDING', 'APPROVED')
                AND (:periodStart IS NULL OR r.created_at >= :periodStart)
            WHERE m.location_node_seq = :buildingId
              AND m.user_type = 'USER'
            GROUP BY m.seq, m.nickname
            ORDER BY reportCount DESC, totalKwh DESC, m.nickname ASC
            """, nativeQuery = true)
    List<BuildingRankingProjection> findBuildingRanking(
            @Param("buildingId") Long buildingId,
            @Param("periodStart") LocalDateTime periodStart
    );
}

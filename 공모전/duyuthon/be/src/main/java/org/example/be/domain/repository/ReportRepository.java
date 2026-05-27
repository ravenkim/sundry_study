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
import java.util.List;
import java.util.Optional;

@Repository
public interface ReportRepository extends JpaRepository<Report, Long> {

    String REPORT_SUMMARY_SELECT = """
            SELECT r.seq AS seq,
                   r.locationDetail AS locationDetail,
                   r.status AS status,
                   r.pointAwarded AS pointAwarded,
                   r.estimatedPoint AS estimatedPoint,
                   r.offTimeMinutes AS offTimeMinutes,
                   r.estimatedKwh AS estimatedKwh,
                   r.createdAt AS createdAt,
                   r.wasteType.isLightWasting AS isLightWasting,
                   r.wasteType.isAcWasting AS isAcWasting,
                   r.wasteType.isHeaterWasting AS isHeaterWasting,
                   r.wasteType.isOtherWasting AS isOtherWasting,
                   r.imageUrl AS imageUrl
            FROM Report r
            """;

    @Query(REPORT_SUMMARY_SELECT + """
            WHERE r.member.seq = :memberSeq
            ORDER BY r.createdAt DESC
            """)
    Page<ReportSummaryProjection> findSummariesByMemberSeq(
            @Param("memberSeq") Long memberSeq,
            Pageable pageable
    );

    @Query(REPORT_SUMMARY_SELECT + """
            WHERE r.member.seq = :memberSeq
              AND r.status = :status
            ORDER BY r.createdAt DESC
            """)
    Page<ReportSummaryProjection> findSummariesByMemberSeqAndStatus(
            @Param("memberSeq") Long memberSeq,
            @Param("status") ReportStatus status,
            Pageable pageable
    );

    Optional<Report> findBySeqAndMember_Seq(Long seq, Long memberSeq);

    boolean existsByLocationNode_Seq(Long locationSeq);

    boolean existsByMember_SeqAndLocationNode_Seq(Long memberSeq, Long locationSeq);

    boolean existsByMember_SeqAndLocationNode_SeqAndStatus(
            Long memberSeq,
            Long locationSeq,
            ReportStatus status
    );

    List<Report> findByMember_SeqAndStatusIn(
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
            WHERE m.affiliation_seq = :affiliationId
              AND m.user_type = 'USER'
            GROUP BY m.seq, m.nickname
            ORDER BY reportCount DESC, totalKwh DESC, m.nickname ASC
            """, nativeQuery = true)
    List<AffiliationRankingProjection> findAffiliationRanking(
            @Param("affiliationId") Long affiliationId,
            @Param("periodStart") LocalDateTime periodStart
    );
}

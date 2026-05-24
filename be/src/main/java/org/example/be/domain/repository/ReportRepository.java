package org.example.be.domain.repository;

import org.example.be.domain.model.Report;
import org.example.be.domain.model.ReportStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ReportRepository extends JpaRepository<Report, Long> {

    Page<Report> findByMember_SeqOrderByCreatedAtDesc(Long memberSeq, Pageable pageable);

    Page<Report> findByMember_SeqAndStatusOrderByCreatedAtDesc(
            Long memberSeq, ReportStatus status, Pageable pageable);

    Optional<Report> findBySeqAndMember_Seq(Long seq, Long memberSeq);

    boolean existsByLocationNode_Seq(Long locationSeq);
}
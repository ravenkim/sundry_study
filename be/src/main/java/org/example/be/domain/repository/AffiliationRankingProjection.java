package org.example.be.domain.repository;

public interface AffiliationRankingProjection {
    Long getMemberSeq();

    String getNickname();

    Long getReportCount();

    Double getTotalKwh();

    Long getPointAwarded();
}

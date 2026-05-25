package org.example.be.domain.repository;

import org.example.be.domain.model.ReportStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public interface ReportSummaryProjection {

    Long getSeq();

    String getLocationDetail();

    ReportStatus getStatus();

    Integer getPointAwarded();

    Integer getEstimatedPoint();

    Integer getOffTimeMinutes();

    BigDecimal getEstimatedKwh();

    LocalDateTime getCreatedAt();

    Boolean getIsLightWasting();

    Boolean getIsAcWasting();

    Boolean getIsHeaterWasting();

    Boolean getIsOtherWasting();

    String getImageUrl();
}

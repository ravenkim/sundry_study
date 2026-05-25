package org.example.be.service.admin;

import org.example.be.domain.model.Report;
import org.example.be.domain.model.ReportStatus;
import org.example.be.domain.model.WasteType;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;

import static org.assertj.core.api.Assertions.assertThat;

class AdminReportSupportTest {

    @Test
    void matchesAffiliationFilter_usesLocationNodeAffiliation() {
        org.example.be.domain.model.Affiliation affiliation = new org.example.be.domain.model.Affiliation();
        affiliation.setSeq(1L);

        org.example.be.domain.model.LocationNode locationNode = new org.example.be.domain.model.LocationNode();
        locationNode.setAffiliation(affiliation);

        Report report = new Report();
        report.setLocationNode(locationNode);

        assertThat(AdminReportSupport.matchesAffiliationFilter(report, 1L)).isTrue();
        assertThat(AdminReportSupport.matchesAffiliationFilter(report, 2L)).isFalse();
    }

    @Test
    void co2KgFromKwh_usesGridFactor() {
        assertThat(AdminReportSupport.co2KgFromKwh(10)).isEqualTo(4.6);
    }

    @Test
    void displayPoints_prefersAwardedOverEstimated() {
        Report report = new Report();
        report.setPointAwarded(50);
        report.setEstimatedPoint(80);
        assertThat(AdminReportSupport.displayPoints(report)).isEqualTo(50);
    }

    @Test
    void buildAiResultSummary_formatsWasteFlags() {
        WasteType wasteType = new WasteType(true, false, false, false);
        assertThat(AdminReportSupport.buildAiResultSummary(wasteType))
                .isEqualTo("조명 ON / AC OFF");
    }

    @Test
    void countsTowardSavings_includesPendingAndApproved() {
        Report pending = new Report();
        pending.setStatus(ReportStatus.PENDING);
        Report rejected = new Report();
        rejected.setStatus(ReportStatus.REJECTED);

        assertThat(AdminReportSupport.countsTowardSavings(pending)).isTrue();
        assertThat(AdminReportSupport.countsTowardSavings(rejected)).isFalse();
    }

    @Test
    void sumKwh_sumsOnlySavingsStatuses() {
        Report approved = new Report();
        approved.setStatus(ReportStatus.APPROVED);
        approved.setEstimatedKwh(BigDecimal.valueOf(2.5));

        Report rejected = new Report();
        rejected.setStatus(ReportStatus.REJECTED);
        rejected.setEstimatedKwh(BigDecimal.valueOf(9));

        assertThat(AdminReportSupport.sumKwh(java.util.List.of(approved, rejected)).doubleValue())
                .isEqualTo(2.5);
    }
}

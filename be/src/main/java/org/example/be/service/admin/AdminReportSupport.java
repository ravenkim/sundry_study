package org.example.be.service.admin;

import org.example.be.domain.model.LocationNode;
import org.example.be.domain.model.Report;
import org.example.be.domain.model.ReportStatus;
import org.example.be.domain.model.WasteType;
import org.example.be.service.savings.EnergyConstants;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

final class AdminReportSupport {

    static final List<ReportStatus> SAVINGS_STATUSES = List.of(
            ReportStatus.PENDING,
            ReportStatus.APPROVED
    );

    private AdminReportSupport() {
    }

    static LocationNode findRoot(LocationNode node) {
        LocationNode current = node;
        while (current.getParent() != null) {
            current = current.getParent();
        }
        return current;
    }

    static boolean matchesBuildingFilter(Report report, Long buildingId) {
        if (buildingId == null || report.getLocationNode() == null) {
            return true;
        }
        return findRoot(report.getLocationNode()).getSeq().equals(buildingId);
    }

    static boolean countsTowardSavings(Report report) {
        return report.getStatus() != null && SAVINGS_STATUSES.contains(report.getStatus());
    }

    static double kwhOrZero(Report report) {
        if (report.getEstimatedKwh() == null) {
            return 0;
        }
        return Math.max(0, report.getEstimatedKwh().doubleValue());
    }

    static int savingsKrwOrZero(Report report) {
        if (report.getEstimatedSavingsKrw() == null) {
            return 0;
        }
        return Math.max(0, report.getEstimatedSavingsKrw());
    }

    static double co2KgFromKwh(double kwh) {
        return round1(kwh * EnergyConstants.CO2_KG_PER_KWH);
    }

    static int displayPoints(Report report) {
        if (report.getPointAwarded() != null && report.getPointAwarded() > 0) {
            return report.getPointAwarded();
        }
        return report.getEstimatedPoint() != null ? report.getEstimatedPoint() : 0;
    }

    static String buildAiResultSummary(WasteType wasteType) {
        if (wasteType == null) {
            return "판별 정보 없음";
        }
        List<String> parts = new ArrayList<>();
        parts.add("조명 " + (wasteType.isLightWasting() ? "ON" : "OFF"));
        parts.add("AC " + (wasteType.isAcWasting() ? "ON" : "OFF"));
        if (wasteType.isHeaterWasting()) {
            parts.add("히터 ON");
        }
        if (wasteType.isOtherWasting()) {
            parts.add("기타 낭비");
        }
        return String.join(" / ", parts);
    }

    static String maskMemberName(String userName) {
        if (userName == null || userName.isBlank()) {
            return "익명";
        }
        String trimmed = userName.trim();
        if (trimmed.length() <= 1) {
            return trimmed;
        }
        return trimmed.charAt(0) + "*" + trimmed.substring(trimmed.length() - 1);
    }

    static double round1(double value) {
        return Math.round(value * 10.0) / 10.0;
    }

    static BigDecimal sumKwh(List<Report> reports) {
        double total = 0;
        for (Report report : reports) {
            if (!countsTowardSavings(report)) {
                continue;
            }
            total += kwhOrZero(report);
        }
        return BigDecimal.valueOf(total);
    }
}

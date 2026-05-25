package org.example.be.service.admin;

import lombok.RequiredArgsConstructor;
import org.example.be.api.response.AdminResponse;
import org.example.be.domain.model.Report;
import org.example.be.domain.model.ReportStatus;
import org.example.be.domain.repository.ReportRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.YearMonth;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AdminDashboardService {

    private final ReportRepository reportRepository;

    public AdminResponse.Dashboard getDashboard(
            Long buildingId,
            Long affiliationId,
            Integer year,
            Integer month
    ) {
        YearMonth targetMonth = resolveMonth(year, month);
        LocalDate today = LocalDate.now();

        LocalDateTime todayStart = today.atStartOfDay();
        LocalDateTime todayEnd = today.atTime(LocalTime.MAX);

        LocalDateTime monthStart = targetMonth.atDay(1).atStartOfDay();
        LocalDateTime monthEnd = targetMonth.atEndOfMonth().atTime(LocalTime.MAX);

        List<Report> allReports = reportRepository.findAllByOrderByCreatedAtDesc();
        List<Report> scoped = allReports.stream()
                .filter(report -> AdminReportSupport.matchesAdminScope(report, buildingId, affiliationId))
                .toList();

        int todayReports = (int) scoped.stream()
                .filter(report -> isBetween(report, todayStart, todayEnd))
                .count();

        int pendingReports = (int) scoped.stream()
                .filter(report -> report.getStatus() == ReportStatus.PENDING)
                .count();

        int monthlyReports = (int) scoped.stream()
                .filter(report -> isBetween(report, monthStart, monthEnd))
                .count();

        int monthlySavingsKrw = scoped.stream()
                .filter(report -> isBetween(report, monthStart, monthEnd))
                .filter(AdminReportSupport::countsTowardSavings)
                .mapToInt(AdminReportSupport::savingsKrwOrZero)
                .sum();

        double totalCo2SavedKg = AdminReportSupport.co2KgFromKwh(
                AdminReportSupport.sumKwh(
                        scoped.stream()
                                .filter(AdminReportSupport::countsTowardSavings)
                                .toList()
                ).doubleValue()
        );

        return AdminResponse.Dashboard.builder()
                .todayReports(todayReports)
                .pendingReports(pendingReports)
                .totalCo2SavedKg(totalCo2SavedKg)
                .monthlyReports(monthlyReports)
                .monthlySavingsKrw(monthlySavingsKrw)
                .build();
    }

    private YearMonth resolveMonth(Integer year, Integer month) {
        if (year != null && month != null) {
            return YearMonth.of(year, month);
        }
        return YearMonth.now();
    }

    private boolean isBetween(Report report, LocalDateTime start, LocalDateTime end) {
        if (report.getCreatedAt() == null) {
            return false;
        }
        LocalDateTime createdAt = report.getCreatedAt();
        return !createdAt.isBefore(start) && !createdAt.isAfter(end);
    }
}

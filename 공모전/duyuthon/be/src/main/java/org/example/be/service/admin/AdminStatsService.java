package org.example.be.service.admin;

import lombok.RequiredArgsConstructor;
import org.example.be.api.response.AdminResponse;
import org.example.be.domain.model.Report;
import org.example.be.domain.model.ReportStatus;
import org.example.be.domain.model.WasteType;
import org.example.be.domain.repository.ReportRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Objects;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AdminStatsService {

    private static final int TOP_BUILDINGS = 5;
    private static final int TOP_LIGHT_WASTE_ROOMS = 10;
    private static final int MONTHLY_HISTORY = 6;
    private static final List<String> WASTE_CATEGORY_ORDER = List.of(
            "조명 소등",
            "냉난방 차단"
    );

    private final ReportRepository reportRepository;

    public AdminResponse.Stats getStats(Long buildingId, Long affiliationId) {
        List<Report> scoped = reportRepository.findAllByOrderByCreatedAtDesc().stream()
                .filter(report -> AdminReportSupport.matchesAdminScope(report, buildingId, affiliationId))
                .toList();

        return AdminResponse.Stats.builder()
                .totalReports(scoped.size())
                .buildingShares(buildBuildingShares(scoped))
                .wasteByCategory(buildWasteCategories(scoped))
                .monthlySummaries(buildMonthlySummaries(scoped))
                .topLightWasteRooms(buildTopLightWasteRooms(scoped))
                .build();
    }

    private List<AdminResponse.LightWasteRoom> buildTopLightWasteRooms(List<Report> reports) {
        Map<String, RoomAggregate> aggregates = new LinkedHashMap<>();

        for (Report report : reports) {
            if (!isLightWasteReport(report)) {
                continue;
            }

            RoomLocation location = resolveRoomLocation(report);
            String key = location.key();
            RoomAggregate aggregate = aggregates.computeIfAbsent(key, ignored -> new RoomAggregate(location));
            aggregate.reportCount++;
            if (report.getCreatedAt() != null
                    && (aggregate.lastReportedAt == null || report.getCreatedAt().isAfter(aggregate.lastReportedAt))) {
                aggregate.lastReportedAt = report.getCreatedAt();
            }
        }

        List<RoomAggregate> sorted = aggregates.values().stream()
                .sorted(Comparator
                        .comparingInt(RoomAggregate::getReportCount).reversed()
                        .thenComparing(
                                RoomAggregate::getLastReportedAt,
                                Comparator.nullsLast(Comparator.reverseOrder())
                        ))
                .limit(TOP_LIGHT_WASTE_ROOMS)
                .toList();

        List<AdminResponse.LightWasteRoom> rooms = new ArrayList<>();
        for (int i = 0; i < sorted.size(); i++) {
            RoomAggregate aggregate = sorted.get(i);
            rooms.add(AdminResponse.LightWasteRoom.builder()
                    .rank(i + 1)
                    .locationId(aggregate.location.locationId())
                    .buildingName(aggregate.location.buildingName())
                    .roomName(aggregate.location.roomName())
                    .locationPath(aggregate.location.locationPath())
                    .reportCount(aggregate.reportCount)
                    .lastReportedAt(aggregate.lastReportedAt != null ? aggregate.lastReportedAt.toString() : null)
                    .build());
        }

        return rooms;
    }

    private boolean isLightWasteReport(Report report) {
        if (report.getStatus() == ReportStatus.REJECTED) {
            return false;
        }
        WasteType wasteType = report.getWasteType();
        return wasteType != null && wasteType.isLightWasting();
    }

    private RoomLocation resolveRoomLocation(Report report) {
        if (report.getLocationNode() != null) {
            String buildingName = AdminReportSupport.findRoot(report.getLocationNode()).getName();
            String roomName = report.getLocationNode().getName();
            String locationPath = report.getLocationDetail() != null && !report.getLocationDetail().isBlank()
                    ? report.getLocationDetail()
                    : buildingName + " > " + roomName;
            return new RoomLocation(
                    "node:" + report.getLocationNode().getSeq(),
                    report.getLocationNode().getSeq(),
                    buildingName,
                    roomName,
                    locationPath
            );
        }

        String locationDetail = report.getLocationDetail();
        if (locationDetail != null && locationDetail.contains(" > ")) {
            String[] parts = locationDetail.split(" > ");
            return new RoomLocation(
                    "detail:" + locationDetail,
                    null,
                    parts[0],
                    parts[parts.length - 1],
                    locationDetail
            );
        }

        return new RoomLocation(
                "detail:" + Objects.toString(locationDetail, "unknown"),
                null,
                "미지정",
                locationDetail != null ? locationDetail : "미지정",
                locationDetail != null ? locationDetail : "미지정"
        );
    }

    private List<AdminResponse.BuildingShare> buildBuildingShares(List<Report> reports) {
        Map<String, Integer> counts = new LinkedHashMap<>();
        for (Report report : reports) {
            String buildingName = resolveBuildingName(report);
            counts.merge(buildingName, 1, Integer::sum);
        }

        List<Map.Entry<String, Integer>> sorted = counts.entrySet().stream()
                .sorted(Map.Entry.<String, Integer>comparingByValue().reversed())
                .toList();

        int total = reports.size();
        List<AdminResponse.BuildingShare> shares = new ArrayList<>();
        int others = 0;

        for (int i = 0; i < sorted.size(); i++) {
            Map.Entry<String, Integer> entry = sorted.get(i);
            if (i < TOP_BUILDINGS) {
                shares.add(AdminResponse.BuildingShare.builder()
                        .name(entry.getKey())
                        .count(entry.getValue())
                        .percentage(percent(entry.getValue(), total))
                        .build());
            } else {
                others += entry.getValue();
            }
        }

        if (others > 0) {
            shares.add(AdminResponse.BuildingShare.builder()
                    .name("기타")
                    .count(others)
                    .percentage(percent(others, total))
                    .build());
        }

        return shares;
    }

    private List<AdminResponse.CategoryCount> buildWasteCategories(List<Report> reports) {
        Map<String, Integer> counts = new LinkedHashMap<>();
        for (String name : WASTE_CATEGORY_ORDER) {
            counts.put(name, 0);
        }

        for (Report report : reports) {
            WasteType wasteType = report.getWasteType();
            if (wasteType == null) {
                continue;
            }
            if (wasteType.isLightWasting()) {
                counts.merge("조명 소등", 1, Integer::sum);
            }
            if (wasteType.isAcWasting()) {
                counts.merge("냉난방 차단", 1, Integer::sum);
            }
        }

        return WASTE_CATEGORY_ORDER.stream()
                .map(name -> AdminResponse.CategoryCount.builder()
                        .name(name)
                        .count(counts.getOrDefault(name, 0))
                        .build())
                .toList();
    }

    private List<AdminResponse.MonthlySummary> buildMonthlySummaries(List<Report> reports) {
        YearMonth current = YearMonth.now();
        DateTimeFormatter labelFormatter = DateTimeFormatter.ofPattern("yyyy년 M월", Locale.KOREAN);
        List<AdminResponse.MonthlySummary> summaries = new ArrayList<>();

        for (int i = 0; i < MONTHLY_HISTORY; i++) {
            YearMonth month = current.minusMonths(i);
            List<Report> monthReports = reports.stream()
                    .filter(report -> report.getCreatedAt() != null
                            && YearMonth.from(report.getCreatedAt()).equals(month))
                    .toList();

            int total = monthReports.size();
            int completed = (int) monthReports.stream()
                    .filter(report -> report.getStatus() == ReportStatus.APPROVED)
                    .count();
            int completedPercent = percent(completed, total);
            double co2 = AdminReportSupport.co2KgFromKwh(
                    AdminReportSupport.sumKwh(
                            monthReports.stream()
                                    .filter(AdminReportSupport::countsTowardSavings)
                                    .toList()
                    ).doubleValue()
            );
            int points = monthReports.stream()
                    .filter(report -> report.getStatus() != ReportStatus.REJECTED)
                    .mapToInt(AdminReportSupport::displayPoints)
                    .sum();

            summaries.add(AdminResponse.MonthlySummary.builder()
                    .monthLabel(month.format(labelFormatter))
                    .totalReports(total)
                    .completedReports(completed)
                    .completedPercent(completedPercent)
                    .co2SavedKg(co2)
                    .pointsAwarded(points)
                    .build());
        }

        return summaries;
    }

    private String resolveBuildingName(Report report) {
        if (report.getLocationNode() != null) {
            return AdminReportSupport.findRoot(report.getLocationNode()).getName();
        }
        if (report.getLocationDetail() != null && report.getLocationDetail().contains(" > ")) {
            return report.getLocationDetail().split(" > ")[0];
        }
        return "미지정";
    }

    private int percent(int part, int total) {
        if (total <= 0) {
            return 0;
        }
        return (int) Math.round((part * 100.0) / total);
    }

    private record RoomLocation(
            String key,
            Long locationId,
            String buildingName,
            String roomName,
            String locationPath
    ) {
    }

    private static final class RoomAggregate {
        private final RoomLocation location;
        private int reportCount;
        private LocalDateTime lastReportedAt;

        private RoomAggregate(RoomLocation location) {
            this.location = location;
        }

        private int getReportCount() {
            return reportCount;
        }

        private LocalDateTime getLastReportedAt() {
            return lastReportedAt;
        }
    }
}

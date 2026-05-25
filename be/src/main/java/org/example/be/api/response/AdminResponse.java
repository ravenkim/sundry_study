package org.example.be.api.response;

import lombok.Builder;
import lombok.Getter;

import java.util.List;

public class AdminResponse {

    @Getter
    @Builder
    public static class Dashboard {
        private int todayReports;
        private int pendingReports;
        private double totalCo2SavedKg;
        private int monthlyReports;
        private int monthlySavingsKrw;
    }

    @Getter
    @Builder
    public static class Stats {
        private int totalReports;
        private List<BuildingShare> buildingShares;
        private List<CategoryCount> wasteByCategory;
        private List<MonthlySummary> monthlySummaries;
        private List<LightWasteRoom> topLightWasteRooms;
    }

    @Getter
    @Builder
    public static class LightWasteRoom {
        private int rank;
        private Long locationId;
        private String buildingName;
        private String roomName;
        private String locationPath;
        private int reportCount;
        private String lastReportedAt;
    }

    @Getter
    @Builder
    public static class BuildingShare {
        private String name;
        private int count;
        private int percentage;
    }

    @Getter
    @Builder
    public static class CategoryCount {
        private String name;
        private int count;
    }

    @Getter
    @Builder
    public static class MonthlySummary {
        private String monthLabel;
        private int totalReports;
        private int completedReports;
        private int completedPercent;
        private double co2SavedKg;
        private int pointsAwarded;
    }

    @Getter
    @Builder
    public static class ReportRow {
        private Long reportId;
        private String buildingName;
        private String roomName;
        private String locationPath;
        private String memberName;
        private String status;
        private String aiResult;
        private int pointAwarded;
        private String createdAt;
        private String imageUrl;
    }
}

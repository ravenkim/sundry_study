package org.example.be.api.response;

import lombok.Builder;
import lombok.Getter;

import java.util.List;

public class ReportResponse {

    @Getter
    @Builder
    public static class AiResult {
        private String result;
        private String message;
        private String ac_status;
        private String light_status;
        private String reason;
        private String expected;
        private String expectedKwh;
        private Integer pointAwarded;
        private Integer currentBalance;
    }

    @Getter
    @Builder
    public static class Create {
        private Long reportId;
        private String status;
        private String message;
        private AiResult aiResult;
    }

    @Getter
    @Builder
    public static class Summary {
        private Long reportId;
        private String roomName;
        private String status;
        private int pointAwarded;
        private Integer estimatedPoint;
        private Integer offTimeMinutes;
        private String estimatedKwh;
        private String createdAt;
        private String detectionLabel;
        private String thumbnailUrl;
    }

    @Getter
    @Builder
    public static class Detail {
        private Long reportId;
        private String roomName;
        private String status;
        private int pointAwarded;
        private Integer estimatedPoint;
        private Integer offTimeMinutes;
        private String estimatedKwh;
        private String createdAt;
        private String detectionLabel;
        private String thumbnailUrl;
        private String buildingName;
        private String imageUrl;
        private Object aiResult;
    }

    @Getter
    @Builder
    public static class Page {
        private List<Summary> content;
        private long totalElements;
        private int totalPages;
        private int page;
        private int size;
    }
}

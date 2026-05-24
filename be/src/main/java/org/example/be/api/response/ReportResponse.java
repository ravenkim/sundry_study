package org.example.be.api.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

public class ReportResponse {

    @Getter
    @Setter
    @Builder
    public static class Create {
        private Long reportId;
        private String status;
        private String message;

        public static Create of(Long reportId, String status, String message) {
            return Create.builder()
                    .reportId(reportId)
                    .status(status)
                    .message(message)
                    .build();
        }
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

package org.example.be.api.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

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
}

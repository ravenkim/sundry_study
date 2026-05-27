package org.example.be.api.request;

import com.fasterxml.jackson.annotation.JsonInclude;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record AiAnalyzeMetadata(
        LocalDateTime reportedAt,
        int acCount,
        int fluorescentCount,
        int ledCount,
        List<OperatingScheduleItem> operatingSchedules,
        Integer electricityRateKrw
) {
    public record OperatingScheduleItem(
            int dayOfWeek,
            boolean closed,
            LocalTime powerOnTime,
            LocalTime powerOffTime
    ) {
    }
}

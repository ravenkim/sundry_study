package org.example.be.api.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import org.springframework.web.multipart.MultipartFile;

public record ReportCreateRequest(
        Long buildingId,
        Long locationId,
        String roomName,
        String description,
        @JsonProperty("isLightWasting")
        Boolean isLightWasting,
        Boolean isAcWasting,
        Boolean isHeaterWasting,
        Boolean isOtherWasting,
        MultipartFile image
) {
    public boolean isLightWastingFlag() {
        return Boolean.TRUE.equals(isLightWasting);
    }

    public boolean isAcWastingFlag() {
        return Boolean.TRUE.equals(isAcWasting);
    }

    public boolean isHeaterWastingFlag() {
        return Boolean.TRUE.equals(isHeaterWasting);
    }

    public boolean isOtherWastingFlag() {
        return Boolean.TRUE.equals(isOtherWasting);
    }
}

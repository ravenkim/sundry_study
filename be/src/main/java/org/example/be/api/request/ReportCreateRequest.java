package org.example.be.api.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import org.springframework.web.multipart.MultipartFile;

public record ReportCreateRequest(
        Long buildingId,
        String roomName,
        String description,
        @JsonProperty("isLightWasting")
        boolean isLightWasting,
        boolean isAcWasting,
        boolean isHeaterWasting,
        boolean isOtherWasting,
        MultipartFile image
) {}

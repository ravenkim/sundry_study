package org.example.be.api.response;

import lombok.Builder;
import lombok.Getter;

import java.util.List;

public class BuildingResponse {

    @Getter
    @Builder
    public static class LocationItem {
        private Long locationId;
        private String name;
    }

    @Getter
    @Builder
    public static class Item {
        private Long buildingId;
        private String name;
        private Long affiliationId;
        private String affiliationName;
        private List<LocationItem> locations;
    }
}

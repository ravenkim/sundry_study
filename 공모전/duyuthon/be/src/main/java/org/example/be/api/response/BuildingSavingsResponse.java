package org.example.be.api.response;

import lombok.Builder;
import lombok.Getter;

import java.util.List;

public class BuildingSavingsResponse {

    @Getter
    @Builder
    public static class Item {
        private Long buildingId;
        private String buildingName;
        private double totalKwh;
        private double thisMonthKwh;
        private int reportCount;
    }

    @Getter
    @Builder
    public static class ListBody {
        private List<Item> buildings;
    }
}

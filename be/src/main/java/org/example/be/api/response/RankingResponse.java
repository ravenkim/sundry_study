package org.example.be.api.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

public class RankingResponse {

    @Getter
    @Setter
    @Builder
    public static class BuildingLeaderboard {
        private Long buildingId;
        private String buildingName;
        private String period;
        private Integer myRank;
        private List<Entry> entries;
    }

    @Getter
    @Setter
    @Builder
    public static class Entry {
        private int rank;
        private Long memberSeq;
        private String nickname;
        private long reportCount;
        private double totalKwh;
        private long pointAwarded;
    }
}

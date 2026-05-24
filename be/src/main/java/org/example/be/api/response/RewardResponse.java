package org.example.be.api.response;

import lombok.Builder;
import lombok.Getter;
import org.example.be.domain.model.GifticonExchange;
import org.example.be.domain.model.GifticonExchangeStatus;
import org.example.be.domain.model.Reward;

import java.time.LocalDateTime;
import java.util.List;

public class RewardResponse {

    private RewardResponse() {
    }

    @Getter
    @Builder
    public static class Item {
        private Long rewardId;
        private String name;
        private int pointCost;
        private String category;
        private String imageKey;
        private String tag;

        public static Item from(Reward reward) {
            return Item.builder()
                    .rewardId(reward.getSeq())
                    .name(reward.getName())
                    .pointCost(reward.getPointCost())
                    .category(reward.getCategory())
                    .imageKey(reward.getImageKey())
                    .tag(reward.getTag())
                    .build();
        }

        public static List<Item> fromList(List<Reward> rewards) {
            return rewards.stream().map(Item::from).toList();
        }
    }

    @Getter
    @Builder
    public static class Exchange {
        private Long transactionId;
        private String rewardName;
        private int pointUsed;
        private int remainingBalance;
        private GifticonExchangeStatus status;

        public static Exchange from(GifticonExchange exchange, int remainingBalance) {
            return Exchange.builder()
                    .transactionId(exchange.getSeq())
                    .rewardName(exchange.getRewardName())
                    .pointUsed(exchange.getPointUsed())
                    .remainingBalance(remainingBalance)
                    .status(exchange.getStatus())
                    .build();
        }
    }

    @Getter
    @Builder
    public static class ExchangeRow {
        private Long exchangeId;
        private String memberName;
        private String memberPhone;
        private String rewardName;
        private int pointUsed;
        private GifticonExchangeStatus status;
        private LocalDateTime createdAt;
        private LocalDateTime processedAt;

        public static ExchangeRow from(GifticonExchange exchange) {
            return ExchangeRow.builder()
                    .exchangeId(exchange.getSeq())
                    .memberName(exchange.getMember().getUserName())
                    .memberPhone(exchange.getMember().getPhoneNumber())
                    .rewardName(exchange.getRewardName())
                    .pointUsed(exchange.getPointUsed())
                    .status(exchange.getStatus())
                    .createdAt(exchange.getCreatedAt())
                    .processedAt(exchange.getProcessedAt())
                    .build();
        }

        public static List<ExchangeRow> fromList(List<GifticonExchange> exchanges) {
            return exchanges.stream().map(ExchangeRow::from).toList();
        }
    }

    @Getter
    @Builder
    public static class ExchangeStats {
        private long pendingCount;
        private long sentCount;
        private long rejectedCount;
        private int pendingPoints;
    }
}

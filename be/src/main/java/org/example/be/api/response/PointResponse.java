package org.example.be.api.response;

import lombok.Builder;
import lombok.Getter;

public class PointResponse {

    @Getter
    @Builder
    public static class Me {
        private int currentBalance;
        private int thisMonthEarned;
        private int totalEarned;
        private int totalRedeemed;

        public static Me of(int currentBalance, int totalRedeemed) {
            return Me.builder()
                    .currentBalance(currentBalance)
                    .thisMonthEarned(0)
                    .totalEarned(currentBalance + totalRedeemed)
                    .totalRedeemed(totalRedeemed)
                    .build();
        }
    }
}

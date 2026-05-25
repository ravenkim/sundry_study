package org.example.be.service.savings;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;

import static org.assertj.core.api.Assertions.assertThat;

class EstimatedKwhResolverTest {

    @Test
    @DisplayName("AI expectedKwh가 있으면 우선 사용")
    void prefersAiKwh() {
        assertThat(EstimatedKwhResolver.resolve("3.8 kWh", 494, BigDecimal.valueOf(130)))
                .isEqualByComparingTo(new BigDecimal("3.8000"));
    }

    @Test
    @DisplayName("expectedKwh 없을 때 절약 금액과 단가로 kWh 역산")
    void fallsBackFromSavingsKrw() {
        assertThat(EstimatedKwhResolver.resolve(null, 183, BigDecimal.valueOf(130)))
                .isEqualByComparingTo(new BigDecimal("1.4077"));
    }

    @Test
    @DisplayName("저장된 kWh가 0이면 절약 금액으로 역산")
    void fallsBackFromStoredZero() {
        assertThat(EstimatedKwhResolver.resolve(BigDecimal.ZERO, 183, BigDecimal.valueOf(130)))
                .isEqualByComparingTo(new BigDecimal("1.4077"));
    }
}

package org.example.be.service.savings;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;

import static org.assertj.core.api.Assertions.assertThat;

class ExpectedKwhParserTest {

    @Test
    @DisplayName("3.8 kWh → 3.8000")
    void parseWithUnit() {
        assertThat(ExpectedKwhParser.parse("3.8 kWh"))
                .isEqualByComparingTo(new BigDecimal("3.8000"));
    }

    @Test
    @DisplayName("1,234.5 kWh → 1234.5000")
    void parseWithComma() {
        assertThat(ExpectedKwhParser.parse("1,234.5 kWh"))
                .isEqualByComparingTo(new BigDecimal("1234.5000"));
    }

    @Test
    @DisplayName("0 kWh → 0")
    void parseZero() {
        assertThat(ExpectedKwhParser.parse("0 kWh")).isEqualByComparingTo(BigDecimal.ZERO);
    }

    @Test
    @DisplayName("null/blank → 0")
    void parseEmpty() {
        assertThat(ExpectedKwhParser.parse(null)).isEqualByComparingTo(BigDecimal.ZERO);
        assertThat(ExpectedKwhParser.parse("")).isEqualByComparingTo(BigDecimal.ZERO);
    }

    @Test
    @DisplayName("잘못된 형식 → 0")
    void parseInvalid() {
        assertThat(ExpectedKwhParser.parse("kWh")).isEqualByComparingTo(BigDecimal.ZERO);
    }
}

package org.example.be.service.savings;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class ExpectedKrwParserTest {

    @Test
    @DisplayName("494원 → 494")
    void parseKoreanWon() {
        assertThat(ExpectedKrwParser.parse("494원")).isEqualTo(494);
    }

    @Test
    @DisplayName("1,234원 → 1234")
    void parseWithComma() {
        assertThat(ExpectedKrwParser.parse("1,234원")).isEqualTo(1234);
    }

    @Test
    @DisplayName("0원 → 0")
    void parseZero() {
        assertThat(ExpectedKrwParser.parse("0원")).isZero();
    }

    @Test
    @DisplayName("null/blank → 0")
    void parseEmpty() {
        assertThat(ExpectedKrwParser.parse(null)).isZero();
        assertThat(ExpectedKrwParser.parse("")).isZero();
        assertThat(ExpectedKrwParser.parse("   ")).isZero();
    }

    @Test
    @DisplayName("잘못된 형식 → 0")
    void parseInvalid() {
        assertThat(ExpectedKrwParser.parse("원")).isZero();
    }

    @Test
    @DisplayName("494원 → 89P (×0.18)")
    void toEstimatedPoint() {
        assertThat(ExpectedKrwParser.toEstimatedPoint(494)).isEqualTo(89);
    }
}

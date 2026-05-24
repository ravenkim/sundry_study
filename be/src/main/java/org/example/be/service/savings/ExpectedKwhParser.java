package org.example.be.service.savings;

import lombok.extern.slf4j.Slf4j;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Slf4j
public final class ExpectedKwhParser {

    private ExpectedKwhParser() {
    }

    public static BigDecimal parse(String expectedKwh) {
        if (expectedKwh == null || expectedKwh.isBlank()) {
            return BigDecimal.ZERO;
        }

        String normalized = expectedKwh
                .replace("kWh", "")
                .replace("KWH", "")
                .replace("kwh", "")
                .replace(",", "")
                .trim();

        if (normalized.isEmpty()) {
            log.warn("expectedKwh 파싱 실패 — 숫자 없음: {}", expectedKwh);
            return BigDecimal.ZERO;
        }

        try {
            return new BigDecimal(normalized).setScale(4, RoundingMode.HALF_UP);
        } catch (NumberFormatException e) {
            log.warn("expectedKwh 파싱 실패 — 형식 오류: {}", expectedKwh);
            return BigDecimal.ZERO;
        }
    }
}

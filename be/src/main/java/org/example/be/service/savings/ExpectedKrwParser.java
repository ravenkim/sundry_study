package org.example.be.service.savings;

import lombok.extern.slf4j.Slf4j;

@Slf4j
public final class ExpectedKrwParser {

    private ExpectedKrwParser() {
    }

    public static int parse(String expected) {
        if (expected == null || expected.isBlank()) {
            return 0;
        }

        String digits = expected.replaceAll("[^0-9]", "");
        if (digits.isEmpty()) {
            log.warn("expected 원화 파싱 실패 — 숫자 없음: {}", expected);
            return 0;
        }

        try {
            return Integer.parseInt(digits);
        } catch (NumberFormatException e) {
            log.warn("expected 원화 파싱 실패 — overflow: {}", expected);
            return 0;
        }
    }

    public static int toEstimatedPoint(int savingsKrw) {
        return (int) Math.round(savingsKrw * EnergyConstants.POINT_RATE);
    }
}

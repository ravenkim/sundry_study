package org.example.be.service.savings;

import java.math.BigDecimal;
import java.math.RoundingMode;

public final class EstimatedKwhResolver {

    private EstimatedKwhResolver() {
    }

    public static BigDecimal resolve(String expectedKwh, int savingsKrw, BigDecimal unitCostKrw) {
        BigDecimal parsed = ExpectedKwhParser.parse(expectedKwh);
        if (parsed.compareTo(BigDecimal.ZERO) > 0) {
            return parsed;
        }
        return fromSavingsKrw(savingsKrw, unitCostKrw);
    }

    public static BigDecimal fromSavingsKrw(int savingsKrw, BigDecimal unitCostKrw) {
        if (savingsKrw <= 0 || unitCostKrw == null || unitCostKrw.compareTo(BigDecimal.ZERO) <= 0) {
            return BigDecimal.ZERO;
        }
        return BigDecimal.valueOf(savingsKrw)
                .divide(unitCostKrw, 4, RoundingMode.HALF_UP);
    }

    public static BigDecimal resolve(BigDecimal storedKwh, Integer savingsKrw, BigDecimal unitCostKrw) {
        if (storedKwh != null && storedKwh.compareTo(BigDecimal.ZERO) > 0) {
            return storedKwh;
        }
        return fromSavingsKrw(savingsKrw != null ? savingsKrw : 0, unitCostKrw);
    }
}

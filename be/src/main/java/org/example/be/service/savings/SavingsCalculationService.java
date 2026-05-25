package org.example.be.service.savings;

import lombok.Builder;
import lombok.Getter;
import org.example.be.domain.model.LocationOperatingSchedule;
import org.example.be.domain.model.WasteType;
import org.example.be.service.tariff.ElectricityTariffService;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.DayOfWeek;
import java.time.Duration;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Service
public class SavingsCalculationService {

    private final ElectricityTariffService electricityTariffService;

    public SavingsCalculationService(ElectricityTariffService electricityTariffService) {
        this.electricityTariffService = electricityTariffService;
    }
    public SavingsResult calculate(
            LocalDateTime reportAt,
            List<LocationOperatingSchedule> schedules,
            WasteType wasteType,
            int acCount,
            int fluorescentCount,
            int ledCount
    ) {
        int offTimeMinutes = resolveOffTimeMinutes(reportAt, schedules);
        double offTimeHours = offTimeMinutes / 60.0;

        BigDecimal totalKwh = BigDecimal.ZERO;

        if (wasteType != null && wasteType.isLightWasting()) {
            totalKwh = totalKwh.add(kwhForResource(EnergyConstants.FLUORESCENT_WATTS, fluorescentCount, offTimeHours));
            totalKwh = totalKwh.add(kwhForResource(EnergyConstants.LED_WATTS, ledCount, offTimeHours));
        }
        if (wasteType != null && wasteType.isAcWasting()) {
            totalKwh = totalKwh.add(kwhForResource(EnergyConstants.AC_WATTS, acCount, offTimeHours));
        }

        totalKwh = totalKwh.setScale(4, RoundingMode.HALF_UP);
        int savingsKrw = totalKwh
                .multiply(electricityTariffService.getEffectiveUnitCostKrw())
                .setScale(0, RoundingMode.HALF_UP)
                .intValue();
        int estimatedPoint = (int) Math.round(savingsKrw * EnergyConstants.POINT_RATE);

        return SavingsResult.builder()
                .offTimeMinutes(offTimeMinutes)
                .estimatedKwh(totalKwh)
                .estimatedSavingsKrw(savingsKrw)
                .estimatedPoint(estimatedPoint)
                .build();
    }

    /**
     * 운영 시간(전원 ON 구간)이 아닐 때만 제보 가능.
     * 휴무일·개방 전·소등 후 → true, 운영 중 → false.
     */
    public boolean isReportableAt(LocalDateTime reportAt, List<LocationOperatingSchedule> schedules) {
        if (schedules == null || schedules.isEmpty()) {
            return true;
        }

        DayOfWeek day = reportAt.getDayOfWeek();
        LocationOperatingSchedule schedule = schedules.stream()
                .filter(s -> s.toDayOfWeek() == day)
                .findFirst()
                .orElse(null);

        if (schedule == null) {
            return true;
        }
        if (schedule.isClosed()) {
            return true;
        }

        LocalTime on = schedule.getPowerOnTime();
        LocalTime off = schedule.getPowerOffTime();
        if (on == null || off == null) {
            return true;
        }

        LocalTime reportTime = reportAt.toLocalTime();
        if (reportTime.isBefore(on)) {
            return true;
        }
        if (!reportTime.isBefore(off)) {
            return true;
        }
        return false;
    }

    int resolveOffTimeMinutes(LocalDateTime reportAt, List<LocationOperatingSchedule> schedules) {
        if (schedules == null || schedules.isEmpty()) {
            return EnergyConstants.OFF_TIME_CAP_MINUTES;
        }

        DayOfWeek day = reportAt.getDayOfWeek();
        LocationOperatingSchedule schedule = schedules.stream()
                .filter(s -> s.toDayOfWeek() == day)
                .findFirst()
                .orElse(null);

        if (schedule == null) {
            return EnergyConstants.OFF_TIME_CAP_MINUTES;
        }

        if (schedule.isClosed()) {
            return capMinutes(minutesUntilMidnight(reportAt));
        }

        LocalTime on = schedule.getPowerOnTime();
        LocalTime off = schedule.getPowerOffTime();
        if (on == null || off == null) {
            return EnergyConstants.OFF_TIME_CAP_MINUTES;
        }

        LocalTime reportTime = reportAt.toLocalTime();

        if (reportTime.isBefore(on)) {
            return capMinutes(Duration.between(reportTime, off).toMinutes());
        }
        if (!reportTime.isBefore(off)) {
            return capMinutes(minutesUntilMidnight(reportAt));
        }
        return (int) Duration.between(reportTime, off).toMinutes();
    }

    private int capMinutes(long minutes) {
        return (int) Math.min(minutes, EnergyConstants.OFF_TIME_CAP_MINUTES);
    }

    private long minutesUntilMidnight(LocalDateTime reportAt) {
        LocalDateTime midnight = reportAt.toLocalDate().plusDays(1).atStartOfDay();
        return Duration.between(reportAt, midnight).toMinutes();
    }

    private BigDecimal kwhForResource(int wattsPerUnit, int quantity, double offTimeHours) {
        if (quantity <= 0 || offTimeHours <= 0) {
            return BigDecimal.ZERO;
        }
        double kwh = wattsPerUnit * quantity / 1000.0 * offTimeHours;
        return BigDecimal.valueOf(kwh);
    }

    @Getter
    @Builder
    public static class SavingsResult {
        private int offTimeMinutes;
        private BigDecimal estimatedKwh;
        private int estimatedSavingsKrw;
        private int estimatedPoint;
    }
}

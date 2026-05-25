package org.example.be.service.savings;

import org.example.be.service.tariff.ElectricityTariffService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.lenient;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class SavingsCalculationServiceTest {

    @Mock
    private ElectricityTariffService electricityTariffService;

    private SavingsCalculationService service;

    @BeforeEach
    void setUp() {
        lenient().when(electricityTariffService.getEffectiveUnitCostKrw())
                .thenReturn(BigDecimal.valueOf(EnergyConstants.ELECTRICITY_RATE_KRW));
        service = new SavingsCalculationService(electricityTariffService);
    }

    @Test
    @DisplayName("운영 시간 중 → 제보 불가")
    void notReportableDuringOperatingHours() {
        var reportAt = java.time.LocalDateTime.of(2026, 5, 18, 15, 0);
        var schedules = java.util.List.of(
                schedule(java.time.DayOfWeek.MONDAY, false, java.time.LocalTime.of(7, 0), java.time.LocalTime.of(22, 0))
        );

        assertThat(service.isReportableAt(reportAt, schedules)).isFalse();
    }

    @Test
    @DisplayName("소등 후 → 제보 가능")
    void reportableAfterPowerOff() {
        var reportAt = java.time.LocalDateTime.of(2026, 5, 18, 23, 0);
        var schedules = java.util.List.of(
                schedule(java.time.DayOfWeek.MONDAY, false, java.time.LocalTime.of(7, 0), java.time.LocalTime.of(22, 0))
        );

        assertThat(service.isReportableAt(reportAt, schedules)).isTrue();
    }

    @Test
    @DisplayName("휴무일 → 제보 가능")
    void reportableOnClosedDay() {
        var reportAt = java.time.LocalDateTime.of(2026, 5, 24, 14, 0);
        var schedules = java.util.List.of(
                schedule(java.time.DayOfWeek.SUNDAY, true, null, null)
        );

        assertThat(service.isReportableAt(reportAt, schedules)).isTrue();
    }

    @Test
    @DisplayName("개방 전 → 제보 가능")
    void reportableBeforePowerOn() {
        var reportAt = java.time.LocalDateTime.of(2026, 5, 18, 6, 0);
        var schedules = java.util.List.of(
                schedule(java.time.DayOfWeek.MONDAY, false, java.time.LocalTime.of(7, 0), java.time.LocalTime.of(22, 0))
        );

        assertThat(service.isReportableAt(reportAt, schedules)).isTrue();
    }

    @Test
    @DisplayName("월요일 15:00 제보, 22:00 소등 → 7시간(420분)")
    void duringOperatingHours() {
        var reportAt = java.time.LocalDateTime.of(2026, 5, 18, 15, 0);
        var schedules = java.util.List.of(
                schedule(java.time.DayOfWeek.MONDAY, false, java.time.LocalTime.of(7, 0), java.time.LocalTime.of(22, 0))
        );

        int minutes = service.resolveOffTimeMinutes(reportAt, schedules);

        assertThat(minutes).isEqualTo(420);
    }

    @Test
    @DisplayName("휴무일 제보 → 2시간 cap")
    void closedDay() {
        var reportAt = java.time.LocalDateTime.of(2026, 5, 24, 14, 0);
        var schedules = java.util.List.of(
                schedule(java.time.DayOfWeek.SUNDAY, true, null, null)
        );

        int minutes = service.resolveOffTimeMinutes(reportAt, schedules);

        assertThat(minutes).isEqualTo(120);
    }

    @Test
    @DisplayName("소등 후 제보 → 2시간 cap")
    void afterPowerOff() {
        var reportAt = java.time.LocalDateTime.of(2026, 5, 18, 23, 0);
        var schedules = java.util.List.of(
                schedule(java.time.DayOfWeek.MONDAY, false, java.time.LocalTime.of(7, 0), java.time.LocalTime.of(22, 0))
        );

        int minutes = service.resolveOffTimeMinutes(reportAt, schedules);

        assertThat(minutes).isEqualTo(60);
    }

    @Test
    @DisplayName("스케줄 없음 → 2시간 fallback")
    void noSchedule() {
        var reportAt = java.time.LocalDateTime.of(2026, 5, 18, 15, 0);

        int minutes = service.resolveOffTimeMinutes(reportAt, java.util.List.of());

        assertThat(minutes).isEqualTo(120);
    }

    @Test
    @DisplayName("조명+에어컨 ON → kWh·포인트 산출")
    void calculateFull() {
        var reportAt = java.time.LocalDateTime.of(2026, 5, 18, 15, 0);
        var schedules = java.util.List.of(
                schedule(java.time.DayOfWeek.MONDAY, false, java.time.LocalTime.of(7, 0), java.time.LocalTime.of(22, 0))
        );
        var wasteType = new org.example.be.domain.model.WasteType(true, true, false, false);

        SavingsCalculationService.SavingsResult result = service.calculate(
                reportAt, schedules, wasteType, 1, 10, 2
        );

        assertThat(result.getOffTimeMinutes()).isEqualTo(420);
        assertThat(result.getEstimatedKwh()).isGreaterThan(BigDecimal.ZERO);
        assertThat(result.getEstimatedSavingsKrw()).isGreaterThan(0);
        assertThat(result.getEstimatedPoint()).isGreaterThan(0);
    }

    private org.example.be.domain.model.LocationOperatingSchedule schedule(
            java.time.DayOfWeek day,
            boolean closed,
            java.time.LocalTime on,
            java.time.LocalTime off
    ) {
        return org.example.be.domain.model.LocationOperatingSchedule.builder()
                .dayOfWeek(day.getValue())
                .closed(closed)
                .powerOnTime(on)
                .powerOffTime(off)
                .build();
    }
}

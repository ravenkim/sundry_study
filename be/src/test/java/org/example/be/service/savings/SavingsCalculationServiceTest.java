package org.example.be.service.savings;

import org.example.be.domain.model.LocationOperatingSchedule;
import org.example.be.domain.model.WasteType;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.time.DayOfWeek;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

class SavingsCalculationServiceTest {

    private SavingsCalculationService service;

    @BeforeEach
    void setUp() {
        service = new SavingsCalculationService();
    }

    @Test
    @DisplayName("월요일 15:00 제보, 22:00 소등 → 7시간(420분)")
    void duringOperatingHours() {
        LocalDateTime reportAt = LocalDateTime.of(2026, 5, 18, 15, 0);
        List<LocationOperatingSchedule> schedules = List.of(
                schedule(DayOfWeek.MONDAY, false, LocalTime.of(7, 0), LocalTime.of(22, 0))
        );

        int minutes = service.resolveOffTimeMinutes(reportAt, schedules);

        assertThat(minutes).isEqualTo(420);
    }

    @Test
    @DisplayName("휴무일 제보 → 2시간 cap")
    void closedDay() {
        LocalDateTime reportAt = LocalDateTime.of(2026, 5, 24, 14, 0);
        List<LocationOperatingSchedule> schedules = List.of(
                schedule(DayOfWeek.SUNDAY, true, null, null)
        );

        int minutes = service.resolveOffTimeMinutes(reportAt, schedules);

        assertThat(minutes).isEqualTo(120);
    }

    @Test
    @DisplayName("소등 후 제보 → 2시간 cap")
    void afterPowerOff() {
        LocalDateTime reportAt = LocalDateTime.of(2026, 5, 18, 23, 0);
        List<LocationOperatingSchedule> schedules = List.of(
                schedule(DayOfWeek.MONDAY, false, LocalTime.of(7, 0), LocalTime.of(22, 0))
        );

        int minutes = service.resolveOffTimeMinutes(reportAt, schedules);

        assertThat(minutes).isEqualTo(60);
    }

    @Test
    @DisplayName("스케줄 없음 → 2시간 fallback")
    void noSchedule() {
        LocalDateTime reportAt = LocalDateTime.of(2026, 5, 18, 15, 0);

        int minutes = service.resolveOffTimeMinutes(reportAt, List.of());

        assertThat(minutes).isEqualTo(120);
    }

    @Test
    @DisplayName("조명+에어컨 ON → kWh·포인트 산출")
    void calculateFull() {
        LocalDateTime reportAt = LocalDateTime.of(2026, 5, 18, 15, 0);
        List<LocationOperatingSchedule> schedules = List.of(
                schedule(DayOfWeek.MONDAY, false, LocalTime.of(7, 0), LocalTime.of(22, 0))
        );
        WasteType wasteType = new WasteType(true, true, false, false);

        SavingsCalculationService.SavingsResult result = service.calculate(
                reportAt, schedules, wasteType, 1, 10, 2
        );

        assertThat(result.getOffTimeMinutes()).isEqualTo(420);
        assertThat(result.getEstimatedKwh()).isGreaterThan(BigDecimal.ZERO);
        assertThat(result.getEstimatedSavingsKrw()).isGreaterThan(0);
        assertThat(result.getEstimatedPoint()).isGreaterThan(0);
    }

    private LocationOperatingSchedule schedule(
            DayOfWeek day,
            boolean closed,
            LocalTime on,
            LocalTime off
    ) {
        return LocationOperatingSchedule.builder()
                .dayOfWeek(day.getValue())
                .closed(closed)
                .powerOnTime(on)
                .powerOffTime(off)
                .build();
    }
}

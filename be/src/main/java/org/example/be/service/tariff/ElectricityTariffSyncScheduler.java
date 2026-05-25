package org.example.be.service.tariff;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
@ConditionalOnProperty(name = "app.kepco.api-key")
public class ElectricityTariffSyncScheduler {

    private final ElectricityTariffService electricityTariffService;

    @EventListener(ApplicationReadyEvent.class)
    public void syncOnStartup() {
        log.info("애플리케이션 기동 — 전기 단가 초기 동기화 시작");
        electricityTariffService.syncRecentMonths();
    }

    /** 매월 5일 03:00 — 전월·전전월 데이터 보강 (한전 월보 반영 지연 고려) */
    @Scheduled(cron = "${app.kepco.sync-cron:0 0 3 5 * *}")
    public void syncMonthly() {
        log.info("월간 전기 단가 동기화 스케줄 실행");
        electricityTariffService.syncRecentMonths();
    }
}

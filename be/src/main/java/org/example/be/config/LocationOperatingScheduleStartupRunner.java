package org.example.be.config;

import lombok.RequiredArgsConstructor;
import org.example.be.service.location.LocationOperatingScheduleSyncService;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class LocationOperatingScheduleStartupRunner {

    private final LocationOperatingScheduleSyncService syncService;

    @EventListener(ApplicationReadyEvent.class)
    public void onApplicationReady() {
        syncService.syncDemoSchedulesForAllLeaves();
    }
}

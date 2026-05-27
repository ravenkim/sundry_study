package org.example.be.service.location;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.be.domain.model.LocationNode;
import org.example.be.domain.model.LocationOperatingSchedule;
import org.example.be.domain.model.NodeKind;
import org.example.be.domain.repository.LocationNodeRepository;
import org.example.be.domain.repository.LocationOperatingScheduleRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class LocationOperatingScheduleSyncService {

    private final LocationNodeRepository locationNodeRepository;
    private final LocationOperatingScheduleRepository operatingScheduleRepository;

    /**
     * LEAF에 운영 스케줄이 없을 때만 기본값(월~일)을 넣는다.
     * Flyway R__seed_dev 와 중복 insert 하지 않도록 기존 행이 있으면 skip.
     */
    @Transactional
    public void syncDemoSchedulesForAllLeaves() {
        List<LocationNode> leaves = locationNodeRepository.findByNodeKind(NodeKind.LEAF);
        int synced = 0;
        for (LocationNode leaf : leaves) {
            if (operatingScheduleRepository.countByLocationNode_Seq(leaf.getSeq()) > 0) {
                continue;
            }
            insertDefaultSchedules(leaf);
            synced++;
        }
        if (synced > 0) {
            log.info("LEAF 운영 스케줄 기본값 적용: {}곳", synced);
        }
    }

    private void insertDefaultSchedules(LocationNode leaf) {
        List<LocationOperatingSchedule> schedules = OperatingScheduleDefaults.toEntities(
                leaf,
                OperatingScheduleDefaults.defaultScheduleItems()
        );
        operatingScheduleRepository.saveAll(schedules);
    }
}

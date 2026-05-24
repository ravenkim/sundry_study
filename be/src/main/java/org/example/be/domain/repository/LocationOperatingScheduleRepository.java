package org.example.be.domain.repository;

import org.example.be.domain.model.LocationOperatingSchedule;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LocationOperatingScheduleRepository extends JpaRepository<LocationOperatingSchedule, Long> {

    List<LocationOperatingSchedule> findByLocationNode_SeqOrderByDayOfWeekAsc(Long locationNodeSeq);

    void deleteByLocationNode_Seq(Long locationNodeSeq);
}

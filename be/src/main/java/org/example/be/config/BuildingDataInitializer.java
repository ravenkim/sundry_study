package org.example.be.config;

import lombok.RequiredArgsConstructor;
import org.example.be.domain.model.Building;
import org.example.be.domain.repository.BuildingRepository;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Component
@RequiredArgsConstructor
public class BuildingDataInitializer implements ApplicationRunner {

    private static final List<String> SEED_BUILDING_NAMES = List.of(
            "공학관 A동",
            "도서관",
            "학생회관",
            "본관"
    );

    private final BuildingRepository buildingRepository;

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        if (buildingRepository.count() > 0) {
            return;
        }
        for (String name : SEED_BUILDING_NAMES) {
            buildingRepository.save(Building.builder().name(name).build());
        }
    }
}

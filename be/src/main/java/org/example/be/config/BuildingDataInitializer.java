package org.example.be.config;

import lombok.RequiredArgsConstructor;
import org.example.be.domain.model.Affiliation;
import org.example.be.domain.model.Building;
import org.example.be.domain.repository.AffiliationRepository;
import org.example.be.domain.repository.BuildingRepository;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Component
@Order(2)
@RequiredArgsConstructor
public class BuildingDataInitializer implements ApplicationRunner {

    private static final List<String> SEED_BUILDING_NAMES = List.of(
            "공학관 A동",
            "도서관",
            "학생회관",
            "본관"
    );

    private final BuildingRepository buildingRepository;
    private final AffiliationRepository affiliationRepository;

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        Affiliation affiliation = affiliationRepository.findAll().stream()
                .findFirst()
                .orElseGet(() -> affiliationRepository.save(
                        Affiliation.builder()
                                .name(AffiliationDataInitializer.DEFAULT_AFFILIATION_NAME)
                                .address(AffiliationDataInitializer.DEFAULT_AFFILIATION_ADDRESS)
                                .build()
                ));

        if (buildingRepository.count() > 0) {
            buildingRepository.findAll().forEach(building -> {
                if (building.getAffiliation() == null) {
                    building.setAffiliation(affiliation);
                }
            });
            return;
        }

        for (String name : SEED_BUILDING_NAMES) {
            buildingRepository.save(
                    Building.builder()
                            .name(name)
                            .affiliation(affiliation)
                            .build()
            );
        }
    }
}

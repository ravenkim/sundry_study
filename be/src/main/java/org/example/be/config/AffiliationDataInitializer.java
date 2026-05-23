package org.example.be.config;

import lombok.RequiredArgsConstructor;
import org.example.be.domain.model.Affiliation;
import org.example.be.domain.repository.AffiliationRepository;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@Order(1)
@RequiredArgsConstructor
public class AffiliationDataInitializer implements ApplicationRunner {

    public static final String DEFAULT_AFFILIATION_NAME = "삼육대학교";
    public static final String DEFAULT_AFFILIATION_ADDRESS = "서울특별시 노원구 화랑로 815";

    private final AffiliationRepository affiliationRepository;

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        if (affiliationRepository.count() > 0) {
            return;
        }
        affiliationRepository.save(
                Affiliation.builder()
                        .name(DEFAULT_AFFILIATION_NAME)
                        .address(DEFAULT_AFFILIATION_ADDRESS)
                        .build()
        );
    }
}

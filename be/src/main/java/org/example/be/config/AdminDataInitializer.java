package org.example.be.config;

import lombok.RequiredArgsConstructor;
import org.example.be.domain.model.Affiliation;
import org.example.be.domain.model.Building;
import org.example.be.domain.model.Member;
import org.example.be.domain.model.MemberPoint;
import org.example.be.domain.model.UserType;
import org.example.be.domain.repository.AffiliationRepository;
import org.example.be.domain.repository.BuildingRepository;
import org.example.be.domain.repository.MemberPointRepository;
import org.example.be.domain.repository.MemberRepository;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@Order(3)
@RequiredArgsConstructor
public class AdminDataInitializer implements ApplicationRunner {

    public static final String ADMIN_USER_NAME = "admin";
    public static final String ADMIN_PASSWORD = "admin1234!";
    public static final String ADMIN_BUILDING_NAME = "공학관 A동";

    private final MemberRepository memberRepository;
    private final MemberPointRepository memberPointRepository;
    private final BuildingRepository buildingRepository;
    private final AffiliationRepository affiliationRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        if (memberRepository.findByUserName(ADMIN_USER_NAME).isPresent()) {
            return;
        }

        Building adminBuilding = buildingRepository.findAll().stream()
                .filter(building -> ADMIN_BUILDING_NAME.equals(building.getName()))
                .findFirst()
                .orElseGet(() -> {
                    Affiliation affiliation = affiliationRepository.findAll().stream()
                            .findFirst()
                            .orElseGet(() -> affiliationRepository.save(
                                    Affiliation.builder()
                                            .name(AffiliationDataInitializer.DEFAULT_AFFILIATION_NAME)
                                            .address(AffiliationDataInitializer.DEFAULT_AFFILIATION_ADDRESS)
                                            .build()
                            ));
                    return buildingRepository.save(
                            Building.builder()
                                    .name(ADMIN_BUILDING_NAME)
                                    .affiliation(affiliation)
                                    .build()
                    );
                });

        Member admin = new Member(
                ADMIN_USER_NAME,
                passwordEncoder.encode(ADMIN_PASSWORD),
                "admin@ecoreport.kr",
                adminBuilding.getAffiliation()
        );
        admin.setBuilding(adminBuilding);
        admin.setUserType(UserType.ADMIN);

        memberRepository.save(admin);
        memberPointRepository.save(new MemberPoint(admin));
    }
}

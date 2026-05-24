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
@Order(4)
@RequiredArgsConstructor
public class UserDataInitializer implements ApplicationRunner {

    public static final String USER_USER_NAME = "user";
    public static final String USER_PASSWORD = "user1234!";
    public static final String USER_BUILDING_NAME = "도서관";

    private final MemberRepository memberRepository;
    private final MemberPointRepository memberPointRepository;
    private final BuildingRepository buildingRepository;
    private final AffiliationRepository affiliationRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        if (memberRepository.findByUserName(USER_USER_NAME).isPresent()) {
            return;
        }

        Building userBuilding = buildingRepository.findAll().stream()
                .filter(building -> USER_BUILDING_NAME.equals(building.getName()))
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
                                    .name(USER_BUILDING_NAME)
                                    .affiliation(affiliation)
                                    .build()
                    );
                });

        Member user = new Member(
                USER_USER_NAME,
                passwordEncoder.encode(USER_PASSWORD),
                "user@ecoreport.kr",
                userBuilding.getAffiliation()
        );
        user.setBuilding(userBuilding);
        user.setUserType(UserType.USER);

        memberRepository.save(user);
        memberPointRepository.save(new MemberPoint(user));
    }
}

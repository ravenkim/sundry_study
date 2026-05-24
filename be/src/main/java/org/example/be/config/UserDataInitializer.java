package org.example.be.config;

import lombok.RequiredArgsConstructor;
import org.example.be.domain.model.Affiliation;
import org.example.be.domain.model.LocationNode;
import org.example.be.domain.model.Member;
import org.example.be.domain.model.MemberPoint;
import org.example.be.domain.model.NodeKind;
import org.example.be.domain.model.UserType;
import org.example.be.domain.repository.AffiliationRepository;
import org.example.be.domain.repository.LocationNodeRepository;
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
    private final LocationNodeRepository locationNodeRepository;
    private final AffiliationRepository affiliationRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        if (memberRepository.findByUserName(USER_USER_NAME).isPresent()) {
            return;
        }

        LocationNode userLocation = locationNodeRepository.findAll().stream()
                .filter(node -> node.getParent() == null)
                .filter(node -> USER_BUILDING_NAME.equals(node.getName()))
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
                    return locationNodeRepository.save(
                            LocationNode.builder()
                                    .name(USER_BUILDING_NAME)
                                    .affiliation(affiliation)
                                    .nodeKind(NodeKind.GROUP)
                                    .depth(1)
                                    .sortOrder(0)
                                    .build()
                    );
                });

        Member user = new Member(
                USER_USER_NAME,
                passwordEncoder.encode(USER_PASSWORD),
                "user@ecoreport.kr",
                userLocation.getAffiliation()
        );
        user.setLocationNode(userLocation);
        user.setUserType(UserType.USER);

        memberRepository.save(user);
        memberPointRepository.save(new MemberPoint(user));
    }
}

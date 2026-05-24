package org.example.be.config;

import lombok.RequiredArgsConstructor;
import org.example.be.domain.model.Affiliation;
import org.example.be.domain.model.LocationNode;
import org.example.be.domain.model.NodeKind;
import org.example.be.domain.repository.AffiliationRepository;
import org.example.be.domain.repository.LocationNodeRepository;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Component
@Order(2)
@RequiredArgsConstructor
public class LocationNodeDataInitializer implements ApplicationRunner {

    private record SeedLocation(String name, NodeKind kind, List<SeedLocation> children) {}

    private static final Map<String, List<SeedLocation>> LOCATIONS_BY_BUILDING = Map.of(
            "공학관 A동", List.of(
                    seed("303호", NodeKind.LEAF),
                    seed("304호", NodeKind.LEAF),
                    seed("2층 복도", NodeKind.LEAF)
            ),
            "도서관", List.of(
                    seed("2열람실", NodeKind.LEAF),
                    seed("3열람실", NodeKind.LEAF)
            ),
            "학생회관", List.of(
                    seed("101호", NodeKind.LEAF),
                    seed("201호", NodeKind.LEAF)
            ),
            "본관", List.of(
                    seed("501호", NodeKind.LEAF),
                    seed("502호", NodeKind.LEAF)
            )
    );

    private static final List<String> SEED_BUILDING_NAMES = List.of(
            "공학관 A동",
            "도서관",
            "학생회관",
            "본관"
    );

    private final LocationNodeRepository locationNodeRepository;
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

        if (locationNodeRepository.count() > 0) {
            return;
        }

        int rootOrder = 0;
        for (String buildingName : SEED_BUILDING_NAMES) {
            LocationNode root = locationNodeRepository.save(
                    LocationNode.builder()
                            .parent(null)
                            .affiliation(affiliation)
                            .name(buildingName)
                            .nodeKind(NodeKind.GROUP)
                            .depth(1)
                            .sortOrder(rootOrder++)
                            .build()
            );

            List<SeedLocation> children = LOCATIONS_BY_BUILDING.getOrDefault(buildingName, List.of());
            saveChildren(root, affiliation, children, 0);
        }
    }

    private void saveChildren(
            LocationNode parent,
            Affiliation affiliation,
            List<SeedLocation> children,
            int startOrder
    ) {
        int order = startOrder;
        for (SeedLocation child : children) {
            LocationNode node = locationNodeRepository.save(
                    LocationNode.builder()
                            .parent(parent)
                            .affiliation(affiliation)
                            .name(child.name())
                            .nodeKind(child.kind())
                            .depth(parent.getDepth() + 1)
                            .sortOrder(order++)
                            .build()
            );
            if (!child.children().isEmpty()) {
                saveChildren(node, affiliation, child.children(), 0);
            }
        }
    }

    private static SeedLocation seed(String name, NodeKind kind) {
        return new SeedLocation(name, kind, List.of());
    }
}

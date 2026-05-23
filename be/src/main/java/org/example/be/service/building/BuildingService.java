package org.example.be.service.building;

import lombok.RequiredArgsConstructor;
import org.example.be.api.response.BuildingResponse;
import org.example.be.domain.model.Building;
import org.example.be.domain.model.Member;
import org.example.be.domain.repository.BuildingRepository;
import org.example.be.domain.repository.MemberRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class BuildingService {

    private static final Map<String, List<BuildingResponse.LocationItem>> LOCATIONS_BY_NAME = Map.of(
            "공학관 A동", List.of(
                    location(101L, "303호"),
                    location(102L, "304호"),
                    location(103L, "2층 복도")
            ),
            "도서관", List.of(
                    location(201L, "2열람실"),
                    location(202L, "3열람실")
            ),
            "학생회관", List.of(
                    location(301L, "101호"),
                    location(302L, "201호")
            ),
            "본관", List.of(
                    location(401L, "501호"),
                    location(402L, "502호")
            )
    );

    private final BuildingRepository buildingRepository;
    private final MemberRepository memberRepository;

    public List<BuildingResponse.Item> listBuildings() {
        return buildingRepository.findAll().stream()
                .map(this::toItem)
                .toList();
    }

    public List<BuildingResponse.Item> listBuildingsForMember(Long memberSeq) {
        Member member = memberRepository.findById(memberSeq)
                .orElseThrow(() -> new org.example.be.exception.BusinessLogicException(
                        org.example.be.exception.ErrorCode.NOT_FOUND, "회원을 찾을 수 없습니다."));

        Building building = member.getBuilding();
        if (building == null) {
            return listBuildings();
        }

        return List.of(toItem(building));
    }

    private BuildingResponse.Item toItem(Building building) {
        List<BuildingResponse.LocationItem> locations =
                LOCATIONS_BY_NAME.getOrDefault(building.getName(), List.of());

        return BuildingResponse.Item.builder()
                .buildingId(building.getSeq())
                .name(building.getName())
                .affiliationId(
                        building.getAffiliation() != null
                                ? building.getAffiliation().getSeq()
                                : null
                )
                .affiliationName(
                        building.getAffiliation() != null
                                ? building.getAffiliation().getName()
                                : null
                )
                .locations(locations)
                .build();
    }

    private static BuildingResponse.LocationItem location(Long locationId, String name) {
        return BuildingResponse.LocationItem.builder()
                .locationId(locationId)
                .name(name)
                .build();
    }
}

package org.example.be.service.building;

import lombok.RequiredArgsConstructor;
import org.example.be.api.response.BuildingResponse;
import org.example.be.domain.model.Affiliation;
import org.example.be.domain.model.LocationNode;
import org.example.be.domain.model.Member;
import org.example.be.domain.repository.MemberRepository;
import org.example.be.exception.BusinessLogicException;
import org.example.be.exception.ErrorCode;
import org.example.be.service.location.LocationNodeService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class BuildingService {

    private final LocationNodeService locationNodeService;
    private final MemberRepository memberRepository;

    public List<BuildingResponse.Item> listBuildings() {
        return locationNodeService.listAllPublicTrees();
    }

    public List<BuildingResponse.Item> listBuildingsForMember(Long memberSeq) {
        Member member = memberRepository.findById(memberSeq)
                .orElseThrow(() -> new BusinessLogicException(
                        ErrorCode.NOT_FOUND, "회원을 찾을 수 없습니다."));

        Affiliation affiliation = member.getAffiliation();
        if (affiliation != null) {
            return locationNodeService.listPublicTrees(affiliation.getSeq());
        }

        LocationNode scopeNode = member.getLocationNode();
        if (scopeNode != null) {
            return locationNodeService.listPublicTreesForScope(scopeNode);
        }

        return listBuildings();
    }
}

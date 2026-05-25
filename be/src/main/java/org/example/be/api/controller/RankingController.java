package org.example.be.api.controller;

import lombok.RequiredArgsConstructor;
import org.example.be.api.response.ApiResponse;
import org.example.be.api.response.RankingResponse;
import org.example.be.api.response.ResponseCode;
import org.example.be.service.ranking.BuildingRankingService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/rankings/building")
@RequiredArgsConstructor
public class RankingController {

    private final BuildingRankingService buildingRankingService;

    @GetMapping("/me")
    public ApiResponse<RankingResponse.BuildingLeaderboard> getMyBuildingRanking(
            @AuthenticationPrincipal Jwt jwt,
            @RequestParam(defaultValue = "month") String period
    ) {
        Long memberSeq = jwt.getClaim("memberSeq");
        return ApiResponse.success(
                ResponseCode.RANKING_BUILDING_ME,
                buildingRankingService.getMyBuildingRanking(memberSeq, period)
        );
    }
}

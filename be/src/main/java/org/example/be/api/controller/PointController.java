package org.example.be.api.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.be.api.request.PointExchangeRequest;
import org.example.be.api.response.ApiResponse;
import org.example.be.api.response.PointResponse;
import org.example.be.api.response.ResponseCode;
import org.example.be.api.response.RewardResponse;
import org.example.be.service.point.PointService;
import org.example.be.service.reward.RewardService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/points")
@RequiredArgsConstructor
public class PointController {

    private final PointService pointService;
    private final RewardService rewardService;

    @GetMapping("/me")
    public ApiResponse<PointResponse.Me> getMyPoints(@AuthenticationPrincipal Jwt jwt) {
        Long memberSeq = jwt.getClaim("memberSeq");
        return ApiResponse.success(ResponseCode.POINTS_ME, pointService.getMyPoints(memberSeq));
    }

    @PostMapping("/exchange")
    public ApiResponse<RewardResponse.Exchange> exchange(
            @AuthenticationPrincipal Jwt jwt,
            @Valid @RequestBody PointExchangeRequest request
    ) {
        Long memberSeq = jwt.getClaim("memberSeq");
        return ApiResponse.success(
                ResponseCode.POINT_EXCHANGE,
                rewardService.exchange(memberSeq, request)
        );
    }

    @GetMapping("/exchanges/me")
    public ApiResponse<List<RewardResponse.ExchangeRow>> getMyExchanges(
            @AuthenticationPrincipal Jwt jwt
    ) {
        Long memberSeq = jwt.getClaim("memberSeq");
        return ApiResponse.success(
                ResponseCode.GIFTICON_EXCHANGES_ME,
                rewardService.getMyExchanges(memberSeq)
        );
    }
}

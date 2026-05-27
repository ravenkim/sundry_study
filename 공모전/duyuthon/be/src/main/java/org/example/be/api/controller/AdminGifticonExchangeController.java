package org.example.be.api.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.be.api.request.GifticonExchangeStatusRequest;
import org.example.be.api.response.ApiResponse;
import org.example.be.api.response.ResponseCode;
import org.example.be.api.response.RewardResponse;
import org.example.be.domain.model.GifticonExchangeStatus;
import org.example.be.service.auth.AdminAuthorizationHelper;
import org.example.be.service.reward.RewardService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/gifticon-exchanges")
@RequiredArgsConstructor
public class AdminGifticonExchangeController {

    private final RewardService rewardService;
    private final AdminAuthorizationHelper adminAuthorizationHelper;

    @GetMapping
    public ApiResponse<List<RewardResponse.ExchangeRow>> getExchanges(
            @AuthenticationPrincipal Jwt jwt,
            @RequestParam(required = false) String status
    ) {
        adminAuthorizationHelper.requireAdmin(jwt.getClaim("memberSeq"));

        GifticonExchangeStatus statusFilter = parseStatus(status);
        return ApiResponse.success(
                ResponseCode.ADMIN_GIFTICON_EXCHANGES,
                rewardService.getAdminExchanges(statusFilter)
        );
    }

    @GetMapping("/stats")
    public ApiResponse<RewardResponse.ExchangeStats> getStats(
            @AuthenticationPrincipal Jwt jwt
    ) {
        adminAuthorizationHelper.requireAdmin(jwt.getClaim("memberSeq"));
        return ApiResponse.success(
                ResponseCode.ADMIN_GIFTICON_EXCHANGE_STATS,
                rewardService.getAdminExchangeStats()
        );
    }

    @PatchMapping("/{exchangeId}")
    public ApiResponse<RewardResponse.ExchangeRow> updateStatus(
            @AuthenticationPrincipal Jwt jwt,
            @PathVariable Long exchangeId,
            @Valid @RequestBody GifticonExchangeStatusRequest request
    ) {
        adminAuthorizationHelper.requireAdmin(jwt.getClaim("memberSeq"));
        return ApiResponse.success(
                ResponseCode.ADMIN_GIFTICON_EXCHANGE_UPDATED,
                rewardService.updateExchangeStatus(exchangeId, request.getStatus())
        );
    }

    private GifticonExchangeStatus parseStatus(String status) {
        if (status == null || status.isBlank() || "ALL".equalsIgnoreCase(status)) {
            return null;
        }
        return GifticonExchangeStatus.valueOf(status);
    }
}

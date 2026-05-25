package org.example.be.api.controller;

import lombok.RequiredArgsConstructor;
import org.example.be.api.response.AdminResponse;
import org.example.be.api.response.ApiResponse;
import org.example.be.api.response.ResponseCode;
import org.example.be.domain.model.Member;
import org.example.be.service.admin.AdminDashboardService;
import org.example.be.service.admin.AdminStatsService;
import org.example.be.service.auth.AdminAuthorizationHelper;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminDashboardController {

    private final AdminDashboardService adminDashboardService;
    private final AdminStatsService adminStatsService;
    private final AdminAuthorizationHelper adminAuthorizationHelper;

    @GetMapping("/dashboard")
    public ApiResponse<AdminResponse.Dashboard> getDashboard(
            @AuthenticationPrincipal Jwt jwt,
            @RequestParam(required = false) Long buildingId,
            @RequestParam(required = false) Integer year,
            @RequestParam(required = false) Integer month
    ) {
        Member admin = adminAuthorizationHelper.requireAdmin(jwt.getClaim("memberSeq"));
        Long affiliationId = admin.getAffiliation() != null ? admin.getAffiliation().getSeq() : null;
        return ApiResponse.success(
                ResponseCode.ADMIN_DASHBOARD,
                adminDashboardService.getDashboard(buildingId, affiliationId, year, month)
        );
    }

    @GetMapping("/stats")
    public ApiResponse<AdminResponse.Stats> getStats(
            @AuthenticationPrincipal Jwt jwt,
            @RequestParam(required = false) Long buildingId
    ) {
        Member admin = adminAuthorizationHelper.requireAdmin(jwt.getClaim("memberSeq"));
        Long affiliationId = admin.getAffiliation() != null ? admin.getAffiliation().getSeq() : null;
        return ApiResponse.success(
                ResponseCode.ADMIN_STATS,
                adminStatsService.getStats(buildingId, affiliationId)
        );
    }
}

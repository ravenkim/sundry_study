package org.example.be.api.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.be.api.request.AdminReportStatusRequest;
import org.example.be.api.response.AdminResponse;
import org.example.be.api.response.ApiResponse;
import org.example.be.api.response.ResponseCode;
import org.example.be.service.admin.AdminReportService;
import org.example.be.service.auth.AdminAuthorizationHelper;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin/reports")
@RequiredArgsConstructor
public class AdminReportController {

    private final AdminReportService adminReportService;
    private final AdminAuthorizationHelper adminAuthorizationHelper;

    @GetMapping
    public ApiResponse<List<AdminResponse.ReportRow>> getReports(
            @AuthenticationPrincipal Jwt jwt,
            @RequestParam(required = false) Long buildingId
    ) {
        adminAuthorizationHelper.requireAdmin(jwt.getClaim("memberSeq"));
        return ApiResponse.success(
                ResponseCode.ADMIN_REPORTS,
                adminReportService.getReports(buildingId)
        );
    }

    @PatchMapping("/{reportId}")
    public ApiResponse<AdminResponse.ReportRow> updateStatus(
            @AuthenticationPrincipal Jwt jwt,
            @PathVariable Long reportId,
            @Valid @RequestBody AdminReportStatusRequest request
    ) {
        adminAuthorizationHelper.requireAdmin(jwt.getClaim("memberSeq"));
        return ApiResponse.success(
                ResponseCode.ADMIN_REPORT_UPDATED,
                adminReportService.updateStatus(reportId, request.getStatus())
        );
    }
}

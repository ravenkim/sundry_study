package org.example.be.api.controller;

import lombok.RequiredArgsConstructor;
import org.example.be.api.request.ReportCreateRequest;
import org.example.be.api.response.ApiResponse;
import org.example.be.api.response.ReportResponse;
import org.example.be.api.response.ResponseCode;
import org.example.be.service.report.ReportService;
import org.springframework.http.MediaType;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;

    @GetMapping("/me")
    public ApiResponse<ReportResponse.Page> getMyReports(
            @AuthenticationPrincipal Jwt jwt,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String status) {
        Long memberSeq = jwt.getClaim("memberSeq");
        return ApiResponse.success(
                ResponseCode.REPORTS_LIST,
                reportService.getMyReports(memberSeq, page, size, status));
    }

    @GetMapping("/{reportId}")
    public ApiResponse<ReportResponse.Detail> getReportDetail(
            @AuthenticationPrincipal Jwt jwt,
            @PathVariable Long reportId) {
        Long memberSeq = jwt.getClaim("memberSeq");
        return ApiResponse.success(
                ResponseCode.REPORT_DETAIL,
                reportService.getReportDetail(memberSeq, reportId));
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ApiResponse<ReportResponse.Create> createReport(
            @AuthenticationPrincipal Jwt jwt,
            @ModelAttribute ReportCreateRequest request) {

        Long memberSeq = jwt.getClaim("memberSeq");
        ReportResponse.Create body = reportService.createReport(request, memberSeq);
        return ApiResponse.success(ResponseCode.REPORT_CREATED, body);
    }
}

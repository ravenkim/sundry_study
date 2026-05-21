package org.example.be.api.controller;

import lombok.RequiredArgsConstructor;
import org.example.be.api.request.ReportCreateRequest;
import org.example.be.api.response.ApiResponse;
import org.example.be.api.response.ReportResponse;
import org.example.be.api.response.ResponseCode;
import org.example.be.domain.model.ReportStatus;
import org.example.be.service.report.ReportService;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<ReportResponse.Create>> createReport(
            @ModelAttribute ReportCreateRequest request) {

        Long createdReportSeq = reportService.createReport(request);

        ReportResponse.Create body = ReportResponse.Create.of(
                createdReportSeq,
                ReportStatus.PENDING.name(),
                "제보가 정상적으로 접수되었습니다. AI 판별 프로세스를 시작합니다."
        );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success(ResponseCode.REPORT_CREATED, body));
    }
}

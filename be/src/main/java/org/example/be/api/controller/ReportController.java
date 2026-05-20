package org.example.be.api.controller;

import lombok.RequiredArgsConstructor;
import org.example.be.api.request.ReportCreateRequest;
import org.example.be.service.ReportService;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;

    // multipart/form-data 형태의 요청을 처리하기 위한 설정
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Map<String, Object>> createReport(@ModelAttribute ReportCreateRequest request) {

        // 1. 서비스 로직을 호출하여 제보 데이터를 DB에 저장하고 생성된 seq를 받아옴
        // (현재 Security가 없으므로 임시로 회원 ID 연동은 생략하거나 고정값 처리 상태)
        Long createdReportSeq = reportService.createReport(request);

        // 2. 프로젝트 공통 응답 규격 포맷에 맞춘 데이터 조립
        // (만약 ApiResponse.success() 같은 커스텀 클래스가 있다면 그걸 사용하셔도 됩니다!)
        Map<String, Object> response = new HashMap<>();
        response.put("code", "SUCCESS");

        Map<String, Object> data = new HashMap<>();
        data.put("reportSeq", createdReportSeq);
        data.put("status", "PENDING"); // 초기 상태: 처리중
        data.put("message", "제보가 정상적으로 접수되었습니다. AI 판별 프로세스를 시작합니다.");

        response.put("data", data);

        // 3. HTTP 상태 코드 201 Created와 함께 응답 반환
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }
}
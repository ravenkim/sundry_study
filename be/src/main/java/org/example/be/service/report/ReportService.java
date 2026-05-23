package org.example.be.service.report;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.be.api.request.ReportCreateRequest;
import org.example.be.api.response.ReportResponse;
import org.example.be.domain.model.*;
import org.example.be.domain.repository.BuildingRepository;
import org.example.be.domain.repository.MemberRepository;
import org.example.be.domain.repository.ReportRepository;
import org.example.be.api.response.AiAnalysisResponse;
import org.example.be.exception.BusinessLogicException;
import org.example.be.exception.ErrorCode;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ReportService {

    private final ReportRepository reportRepository;
    private final BuildingRepository buildingRepository;
    private final MemberRepository memberRepository;

    private static final String AI_API_URL = "https://campus-energy-api-992786420144.us-central1.run.app/analyze";

    @Transactional
    public Long createReport(ReportCreateRequest request, Long memberSeq) {

        Member member = memberRepository.findById(memberSeq)
                .orElseThrow(() -> new BusinessLogicException(ErrorCode.NOT_FOUND, "회원을 찾을 수 없습니다."));

        Building building = buildingRepository.findById(request.buildingId())
                .orElseThrow(() -> new BusinessLogicException(ErrorCode.NOT_FOUND, "존재하지 않는 건물입니다."));

        if (member.getBuilding() != null
                && !member.getBuilding().getSeq().equals(building.getSeq())) {
            throw new BusinessLogicException(ErrorCode.INVALID, "소속 건물에서만 제보할 수 있습니다.");
        }

        if (request.image() == null || request.image().isEmpty()) {
            throw new BusinessLogicException(ErrorCode.INVALID, "현장 사진 이미지는 필수입니다.");
        }

        // 1. AI 서버로 이미지 전송 및 분석 요청
        AiAnalysisResponse aiResponse = callAiApi(request.image());
        log.info("AI Analysis Result: {}", aiResponse.getResult());

        // 2. AI 분석 결과에 따른 강력한 제어 로직 (WASTE_DETECTED 만 통과)
        boolean aiLightWasting = request.isLightWasting();
        boolean aiAcWasting = request.isAcWasting();
        String aiAdviceMessage = "";

        if ("ERROR".equals(aiResponse.getResult())) {
            // 강의실이 아니거나 객체 탐지 실패
            throw new BusinessLogicException(ErrorCode.INVALID, "강의실로 인식되지 않거나 분석할 수 없는 사진입니다: " + aiResponse.getMessage());

        } else if ("PASS".equals(aiResponse.getResult())) {
            // 사람이 있거나 조명/에어컨이 모두 꺼진 정상 상태
            throw new BusinessLogicException(ErrorCode.INVALID, "정상적인 강의실 상태이거나 사람이 있어 제보할 수 없습니다: " + aiResponse.getMessage());

        } else if ("WASTE_DETECTED".equals(aiResponse.getResult())) {
            // 오직 낭비가 발견된 경우에만 통과하여 저장 진행
            aiAdviceMessage = "\n\n[💡 AI 보조 지표: 낭비 확인] " + aiResponse.getMessage();
            if (aiResponse.getReason() != null) {
                aiAdviceMessage += "\n[이유] " + aiResponse.getReason();
            }
            // 관리자 확인이 편하도록 AI가 읽은 데이터로 체크박스를 덮어씌움
            aiLightWasting = "ON".equals(aiResponse.getLight_status());
            aiAcWasting = "ON".equals(aiResponse.getAc_status());

        } else {
            // 예상치 못한 AI 서버 응답
            throw new BusinessLogicException(ErrorCode.INTERNAL_SERVER_ERROR, "알 수 없는 AI 분석 결과입니다.");
        }

        // 3. 이미지 저장 (우선 가상 URL 매핑)
        String imageUrl = "https://storage.ecoreport.kr/reports/" + request.image().getOriginalFilename();

        // 4. WasteType 세팅
        WasteType wasteType = new WasteType(
                aiLightWasting,
                aiAcWasting,
                request.isHeaterWasting(),
                request.isOtherWasting()
        );

        // 5. 엔티티 빌드 및 저장 (상태는 무조건 PENDING)
        Report report = Report.builder()
                .member(member)
                .building(building)
                .locationDetail(request.roomName())
                // 사용자가 쓴 내용 뒤에 AI 분석 결과를 덧붙임
                .description(request.description() + aiAdviceMessage)
                .imageUrl(imageUrl)
                .wasteType(wasteType)
                .status(ReportStatus.PENDING) // 관리자 확인 대기 상태
                .createdAt(LocalDateTime.now())
                .build();

        Report savedReport = reportRepository.save(report);

        return savedReport.getSeq();
    }

    // --- AI API 호출 헬퍼 메서드 ---
    private AiAnalysisResponse callAiApi(MultipartFile file) {
        try {
            RestTemplate restTemplate = new RestTemplate();
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.MULTIPART_FORM_DATA);

            MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
            body.add("file", file.getResource());

            HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);

            ResponseEntity<AiAnalysisResponse> response = restTemplate.postForEntity(
                    AI_API_URL,
                    requestEntity,
                    AiAnalysisResponse.class
            );

            if (response.getBody() == null) {
                throw new RuntimeException("AI API 응답이 비어있습니다.");
            }
            return response.getBody();

        } catch (Exception e) {
            log.error("AI API 통신 실패", e);
            throw new BusinessLogicException(ErrorCode.INTERNAL_SERVER_ERROR, "AI 분석 서버와 통신할 수 없습니다.");
        }
    }

    public ReportResponse.Page getMyReports(Long memberSeq, int page, int size, String statusFilter) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Report> reportPage = resolveStatusFilter(statusFilter)
                .map(status -> reportRepository.findByMember_SeqAndStatusOrderByCreatedAtDesc(
                        memberSeq, status, pageable))
                .orElseGet(() -> reportRepository.findByMember_SeqOrderByCreatedAtDesc(memberSeq, pageable));

        List<ReportResponse.Summary> content = reportPage.getContent().stream()
                .map(this::toSummary)
                .toList();

        return ReportResponse.Page.builder()
                .content(content)
                .totalElements(reportPage.getTotalElements())
                .totalPages(reportPage.getTotalPages())
                .page(page)
                .size(size)
                .build();
    }

    public ReportResponse.Detail getReportDetail(Long memberSeq, Long reportId) {
        Report report = reportRepository.findBySeqAndMember_Seq(reportId, memberSeq)
                .orElseThrow(() -> new BusinessLogicException(ErrorCode.NOT_FOUND, "제보를 찾을 수 없습니다."));

        ReportResponse.Summary summary = toSummary(report);
        return ReportResponse.Detail.builder()
                .reportId(summary.getReportId())
                .roomName(summary.getRoomName())
                .status(summary.getStatus())
                .pointAwarded(summary.getPointAwarded())
                .createdAt(summary.getCreatedAt())
                .detectionLabel(summary.getDetectionLabel())
                .thumbnailUrl(summary.getThumbnailUrl())
                .buildingName(report.getBuilding() != null ? report.getBuilding().getName() : null)
                .imageUrl(report.getImageUrl())
                .aiResult(null)
                .build();
    }

    private Optional<ReportStatus> resolveStatusFilter(String statusFilter) {
        if (statusFilter == null || statusFilter.isBlank() || "ALL".equalsIgnoreCase(statusFilter)) {
            return Optional.empty();
        }
        try {
            return Optional.of(ReportStatus.valueOf(statusFilter));
        } catch (IllegalArgumentException e) {
            return Optional.empty();
        }
    }

    private ReportResponse.Summary toSummary(Report report) {
        String buildingName = report.getBuilding() != null ? report.getBuilding().getName() : "";
        String roomName = buildingName.isBlank()
                ? report.getLocationDetail()
                : buildingName + " " + report.getLocationDetail();

        return ReportResponse.Summary.builder()
                .reportId(report.getSeq())
                .roomName(roomName)
                .status(report.getStatus().name())
                .pointAwarded(0)
                .createdAt(report.getCreatedAt() != null ? report.getCreatedAt().toString() : null)
                .detectionLabel(buildDetectionLabel(report.getWasteType()))
                .thumbnailUrl(report.getImageUrl())
                .build();
    }

    private String buildDetectionLabel(WasteType wasteType) {
        if (wasteType == null) {
            return null;
        }
        List<String> labels = new ArrayList<>();
        if (wasteType.isLightWasting()) {
            labels.add("조명");
        }
        if (wasteType.isAcWasting()) {
            labels.add("에어컨");
        }
        if (wasteType.isHeaterWasting()) {
            labels.add("히터");
        }
        if (wasteType.isOtherWasting()) {
            labels.add("기타");
        }
        return labels.isEmpty() ? null : String.join(", ", labels);
    }
}
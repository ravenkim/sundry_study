package org.example.be.service.report;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.be.api.request.ReportCreateRequest;
import org.example.be.api.response.AiAnalysisResponse;
import org.example.be.api.response.ReportResponse;
import org.example.be.domain.model.*;
import org.example.be.domain.repository.MemberRepository;
import org.example.be.domain.repository.ReportRepository;
import org.example.be.exception.BusinessLogicException;
import org.example.be.exception.ErrorCode;
import org.example.be.service.location.LocationNodeService;
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
    private final MemberRepository memberRepository;
    private final LocationNodeService locationNodeService;

    private static final String AI_API_URL = "https://campus-energy-api-992786420144.us-central1.run.app/analyze";

    @Transactional
    public Long createReport(ReportCreateRequest request, Long memberSeq) {

        Member member = memberRepository.findById(memberSeq)
                .orElseThrow(() -> new BusinessLogicException(ErrorCode.NOT_FOUND, "회원을 찾을 수 없습니다."));

        LocationNode locationNode = resolveLocationNode(request);
        locationNodeService.validateMemberScope(member.getLocationNode(), locationNode);

        if (request.image() == null || request.image().isEmpty()) {
            throw new BusinessLogicException(ErrorCode.INVALID, "현장 사진 이미지는 필수입니다.");
        }

        AiAnalysisResponse aiResponse = callAiApi(request.image());
        log.info("AI Analysis Result: {}", aiResponse.getResult());

        boolean aiLightWasting = request.isLightWasting();
        boolean aiAcWasting = request.isAcWasting();
        String aiAdviceMessage = "";

        if ("ERROR".equals(aiResponse.getResult())) {
            throw new BusinessLogicException(ErrorCode.INVALID, "강의실로 인식되지 않거나 분석할 수 없는 사진입니다: " + aiResponse.getMessage());

        } else if ("PASS".equals(aiResponse.getResult())) {
            throw new BusinessLogicException(ErrorCode.INVALID, "정상적인 강의실 상태이거나 사람이 있어 제보할 수 없습니다: " + aiResponse.getMessage());

        } else if ("WASTE_DETECTED".equals(aiResponse.getResult())) {
            aiAdviceMessage = "\n\n[💡 AI 보조 지표: 낭비 확인] " + aiResponse.getMessage();
            if (aiResponse.getReason() != null) {
                aiAdviceMessage += "\n[이유] " + aiResponse.getReason();
            }
            aiLightWasting = "ON".equals(aiResponse.getLight_status());
            aiAcWasting = "ON".equals(aiResponse.getAc_status());

        } else {
            throw new BusinessLogicException(ErrorCode.INVALID, "알 수 없는 AI 분석 결과입니다.");
        }

        String imageUrl = "https://storage.ecoreport.kr/reports/" + request.image().getOriginalFilename();

        WasteType wasteType = new WasteType(
                aiLightWasting,
                aiAcWasting,
                request.isHeaterWasting(),
                request.isOtherWasting()
        );

        String locationDetail = locationNodeService.buildPath(locationNode);

        Report report = Report.builder()
                .member(member)
                .locationNode(locationNode)
                .locationDetail(locationDetail)
                .description(request.description() + aiAdviceMessage)
                .imageUrl(imageUrl)
                .wasteType(wasteType)
                .status(ReportStatus.PENDING)
                .createdAt(LocalDateTime.now())
                .build();

        Report savedReport = reportRepository.save(report);

        return savedReport.getSeq();
    }

    private LocationNode resolveLocationNode(ReportCreateRequest request) {
        if (request.locationId() != null) {
            return locationNodeService.findLeafNode(request.locationId());
        }

        if (request.roomName() != null && !request.roomName().isBlank()) {
            throw new BusinessLogicException(ErrorCode.INVALID, "장소(locationId)를 선택해 주세요.");
        }

        throw new BusinessLogicException(ErrorCode.INVALID, "제보 장소를 선택해 주세요.");
    }

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

        } catch (BusinessLogicException e) {
            throw e;
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
                .buildingName(extractRootName(report))
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
        return ReportResponse.Summary.builder()
                .reportId(report.getSeq())
                .roomName(report.getLocationDetail())
                .status(report.getStatus().name())
                .pointAwarded(0)
                .createdAt(report.getCreatedAt() != null ? report.getCreatedAt().toString() : null)
                .detectionLabel(buildDetectionLabel(report.getWasteType()))
                .thumbnailUrl(report.getImageUrl())
                .build();
    }

    private String extractRootName(Report report) {
        LocationNode node = report.getLocationNode();
        if (node == null) {
            return null;
        }
        LocationNode current = node;
        while (current.getParent() != null) {
            current = current.getParent();
        }
        return current.getName();
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

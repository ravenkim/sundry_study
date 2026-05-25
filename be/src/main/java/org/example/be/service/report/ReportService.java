package org.example.be.service.report;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.be.api.request.AiAnalyzeMetadata;
import org.example.be.api.request.ReportCreateRequest;
import org.example.be.api.response.AiAnalysisResponse;
import org.example.be.api.response.ReportResponse;
import org.example.be.domain.model.*;
import org.example.be.domain.repository.MemberPointRepository;
import org.example.be.domain.repository.MemberRepository;
import org.example.be.domain.repository.ReportRepository;
import org.example.be.domain.repository.ReportSummaryProjection;
import org.example.be.exception.BusinessLogicException;
import org.example.be.exception.ErrorCode;
import org.example.be.service.location.LocationNodeService;
import org.example.be.service.savings.SavingsCalculationService;
import org.example.be.service.savings.EstimatedKwhResolver;
import org.example.be.service.savings.ExpectedKrwParser;
import org.example.be.service.tariff.ElectricityTariffService;
import org.springframework.beans.factory.annotation.Value;
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

import java.math.BigDecimal;
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
    private final MemberPointRepository memberPointRepository;
    private final LocationNodeService locationNodeService;
    private final SavingsCalculationService savingsCalculationService;
    private final ElectricityTariffService electricityTariffService;
    private final ObjectMapper objectMapper;

    @Value("${app.ai.api-url}")
    private String aiApiUrl;

    @Transactional
    public ReportResponse.Create createReport(ReportCreateRequest request, Long memberSeq) {

        Member member = memberRepository.findById(memberSeq)
                .orElseThrow(() -> new BusinessLogicException(ErrorCode.NOT_FOUND, "회원을 찾을 수 없습니다."));

        LocationNode locationNode = resolveLocationNode(request);
        locationNodeService.validateMemberAffiliation(member.getAffiliation(), locationNode);
        if (member.getAffiliation() == null) {
            locationNodeService.validateMemberScope(member.getLocationNode(), locationNode);
        }

        if (request.image() == null || request.image().isEmpty()) {
            throw new BusinessLogicException(ErrorCode.INVALID, "현장 사진 이미지는 필수입니다.");
        }

        LocalDateTime reportAt = LocalDateTime.now();
        var schedules = locationNodeService.getOperatingSchedules(locationNode.getSeq());

        if (!savingsCalculationService.isReportableAt(reportAt, schedules)) {
            throw new BusinessLogicException(ErrorCode.INVALID,
                    "현재 운영 시간 중인 강의실은 제보할 수 없습니다. 운영 시간이 끝난 후 다시 시도해 주세요.");
        }

        if (reportRepository.existsByMember_SeqAndLocationNode_Seq(memberSeq, locationNode.getSeq())) {
            throw new BusinessLogicException(ErrorCode.ALREADY_EXISTS,
                    "이미 제보한 강의실입니다. 같은 강의실은 중복 제보할 수 없습니다.");
        }

        AiAnalyzeMetadata metadata = buildAnalyzeMetadata(reportAt, locationNode, schedules);

        AiAnalysisResponse aiResponse = callAiApi(request.image(), metadata);
        log.info("AI Analysis Result: {}", aiResponse.getResult());

        boolean aiLightWasting = request.isLightWastingFlag();
        boolean aiAcWasting = request.isAcWastingFlag();
        String aiAdviceMessage = "";

        if ("ERROR".equals(aiResponse.getResult())) {
            throw new BusinessLogicException(ErrorCode.INVALID,
                    "강의실로 인식되지 않습니다. 의자·책상이 보이는 강의실을 촬영해 주세요: "
                            + aiResponse.getMessage());

        } else if ("PASS".equals(aiResponse.getResult())) {
            throw new BusinessLogicException(ErrorCode.INVALID, "정상적인 강의실 상태이거나 사람이 있어 제보할 수 없습니다: " + aiResponse.getMessage());

        } else if ("WASTE_DETECTED".equals(aiResponse.getResult())) {
            aiAdviceMessage = "\n\n[💡 AI 보조 지표: 낭비 확인] " + aiResponse.getMessage();
            if (aiResponse.getReason() != null) {
                aiAdviceMessage += "\n[이유] " + aiResponse.getReason();
            }
            if (aiResponse.getExpected() != null) {
                aiAdviceMessage += "\n[예상 절약] " + aiResponse.getExpected();
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
                request.isHeaterWastingFlag(),
                request.isOtherWastingFlag()
        );

        String locationDetail = locationNodeService.buildPath(locationNode);

        int estimatedSavingsKrw = ExpectedKrwParser.parse(aiResponse.getExpected());
        int estimatedPoint = ExpectedKrwParser.toEstimatedPoint(estimatedSavingsKrw);
        BigDecimal estimatedKwh = EstimatedKwhResolver.resolve(
                aiResponse.getExpectedKwh(),
                estimatedSavingsKrw,
                electricityTariffService.getEffectiveUnitCostKrw()
        );

        MemberPoint wallet = memberPointRepository.findByMember_Seq(memberSeq)
                .orElseGet(() -> memberPointRepository.save(new MemberPoint(member)));
        if (estimatedPoint > 0) {
            wallet.addPoint(estimatedPoint);
        }

        Report report = Report.builder()
                .member(member)
                .locationNode(locationNode)
                .locationDetail(locationDetail)
                .description((request.description() != null ? request.description() : "") + aiAdviceMessage)
                .imageUrl(imageUrl)
                .wasteType(wasteType)
                .status(ReportStatus.APPROVED)
                .createdAt(reportAt)
                .offTimeMinutes(null)
                .estimatedKwh(estimatedKwh)
                .estimatedSavingsKrw(estimatedSavingsKrw)
                .estimatedPoint(estimatedPoint)
                .pointAwarded(estimatedPoint)
                .build();

        Report savedReport = reportRepository.save(report);

        ReportResponse.AiResult aiResult = ReportResponse.AiResult.builder()
                .result(aiResponse.getResult())
                .message(aiResponse.getMessage())
                .ac_status(aiResponse.getAc_status())
                .light_status(aiResponse.getLight_status())
                .reason(aiResponse.getReason())
                .expected(aiResponse.getExpected())
                .expectedKwh(aiResponse.getExpectedKwh())
                .pointAwarded(estimatedPoint)
                .currentBalance(wallet.getPoint())
                .build();

        return ReportResponse.Create.builder()
                .reportId(savedReport.getSeq())
                .status(ReportStatus.APPROVED.name())
                .message(aiResponse.getMessage())
                .aiResult(aiResult)
                .build();
    }

    private AiAnalyzeMetadata buildAnalyzeMetadata(
            LocalDateTime reportAt,
            LocationNode locationNode,
            List<LocationOperatingSchedule> schedules
    ) {
        List<AiAnalyzeMetadata.OperatingScheduleItem> items = schedules.stream()
                .map(schedule -> new AiAnalyzeMetadata.OperatingScheduleItem(
                        schedule.getDayOfWeek(),
                        schedule.isClosed(),
                        schedule.getPowerOnTime(),
                        schedule.getPowerOffTime()
                ))
                .toList();

        return new AiAnalyzeMetadata(
                reportAt,
                locationNode.getAcCount(),
                locationNode.getFluorescentCount(),
                locationNode.getLedCount(),
                items,
                electricityTariffService.getEffectiveUnitCostKrwInt()
        );
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

    private AiAnalysisResponse callAiApi(MultipartFile file, AiAnalyzeMetadata metadata) {
        try {
            RestTemplate restTemplate = new RestTemplate();
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.MULTIPART_FORM_DATA);

            MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
            body.add("file", file.getResource());
            body.add("metadata_str", objectMapper.writeValueAsString(metadata));

            HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);

            ResponseEntity<AiAnalysisResponse> response = restTemplate.postForEntity(
                    aiApiUrl,
                    requestEntity,
                    AiAnalysisResponse.class
            );

            if (response.getBody() == null) {
                throw new RuntimeException("AI API 응답이 비어있습니다.");
            }
            return response.getBody();

        } catch (BusinessLogicException e) {
            throw e;
        } catch (JsonProcessingException e) {
            log.error("AI metadata JSON 직렬화 실패", e);
            throw new BusinessLogicException(ErrorCode.INTERNAL_SERVER_ERROR, "AI 분석 요청을 준비할 수 없습니다.");
        } catch (Exception e) {
            log.error("AI API 통신 실패", e);
            throw new BusinessLogicException(ErrorCode.INTERNAL_SERVER_ERROR, "AI 분석 서버와 통신할 수 없습니다.");
        }
    }

    public ReportResponse.Page getMyReports(Long memberSeq, int page, int size, String statusFilter) {
        Pageable pageable = PageRequest.of(page, size);
        Page<ReportSummaryProjection> reportPage = resolveStatusFilter(statusFilter)
                .map(status -> reportRepository.findSummariesByMemberSeqAndStatus(
                        memberSeq, status, pageable))
                .orElseGet(() -> reportRepository.findSummariesByMemberSeq(memberSeq, pageable));

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
                .estimatedPoint(summary.getEstimatedPoint())
                .offTimeMinutes(summary.getOffTimeMinutes())
                .estimatedKwh(summary.getEstimatedKwh())
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
        return toSummary(
                report.getSeq(),
                report.getLocationDetail(),
                report.getStatus(),
                report.getPointAwarded(),
                report.getEstimatedPoint(),
                report.getOffTimeMinutes(),
                report.getEstimatedKwh(),
                report.getCreatedAt(),
                report.getWasteType(),
                report.getImageUrl()
        );
    }

    private ReportResponse.Summary toSummary(ReportSummaryProjection row) {
        return toSummary(
                row.getSeq(),
                row.getLocationDetail(),
                row.getStatus(),
                row.getPointAwarded(),
                row.getEstimatedPoint(),
                row.getOffTimeMinutes(),
                row.getEstimatedKwh(),
                row.getCreatedAt(),
                toWasteType(row),
                row.getImageUrl()
        );
    }

    private ReportResponse.Summary toSummary(
            Long reportId,
            String locationDetail,
            ReportStatus status,
            Integer pointAwarded,
            Integer estimatedPoint,
            Integer offTimeMinutes,
            BigDecimal estimatedKwh,
            LocalDateTime createdAt,
            WasteType wasteType,
            String imageUrl
    ) {
        int displayPoint = pointAwarded != null && pointAwarded > 0
                ? pointAwarded
                : (estimatedPoint != null ? estimatedPoint : 0);

        return ReportResponse.Summary.builder()
                .reportId(reportId)
                .roomName(locationDetail)
                .status(status.name())
                .pointAwarded(displayPoint)
                .estimatedPoint(estimatedPoint)
                .offTimeMinutes(offTimeMinutes)
                .estimatedKwh(estimatedKwh != null ? estimatedKwh.toPlainString() : null)
                .createdAt(createdAt != null ? createdAt.toString() : null)
                .detectionLabel(buildDetectionLabel(wasteType))
                .thumbnailUrl(imageUrl)
                .build();
    }

    private WasteType toWasteType(ReportSummaryProjection row) {
        if (row.getIsLightWasting() == null
                && row.getIsAcWasting() == null
                && row.getIsHeaterWasting() == null
                && row.getIsOtherWasting() == null) {
            return null;
        }

        return new WasteType(
                Boolean.TRUE.equals(row.getIsLightWasting()),
                Boolean.TRUE.equals(row.getIsAcWasting()),
                Boolean.TRUE.equals(row.getIsHeaterWasting()),
                Boolean.TRUE.equals(row.getIsOtherWasting())
        );
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

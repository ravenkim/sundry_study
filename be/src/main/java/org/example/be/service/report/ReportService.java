package org.example.be.service.report;

import lombok.RequiredArgsConstructor;
import org.example.be.api.request.ReportCreateRequest;
import org.example.be.api.response.ReportResponse;
import org.example.be.domain.model.*;
import org.example.be.domain.repository.BuildingRepository;
import org.example.be.domain.repository.MemberRepository;
import org.example.be.domain.repository.ReportRepository;
import org.example.be.exception.BusinessLogicException;
import org.example.be.exception.ErrorCode;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ReportService {

    private final ReportRepository reportRepository;
    private final BuildingRepository buildingRepository;
    private final MemberRepository memberRepository;

    @Transactional
    public Long createReport(ReportCreateRequest request, Long memberSeq) {

        Member member = memberRepository.findById(memberSeq)
                .orElseThrow(() -> new BusinessLogicException(ErrorCode.NOT_FOUND, "회원을 찾을 수 없습니다."));

        // 선택한 건물 정보 조회
        Building building = buildingRepository.findById(request.buildingId())
                .orElseThrow(() -> new BusinessLogicException(ErrorCode.NOT_FOUND, "존재하지 않는 건물입니다."));

        // 사진 이미지 저장 처리 로직 공간
        // (우선은 파일이 들어오면 가상의 URL을 매핑하고, 들어오지 않으면 null 처리)
        String imageUrl = null;
        if (request.image() != null && !request.image().isEmpty()) {
            imageUrl = "https://storage.ecoreport.kr/reports/" + request.image().getOriginalFilename();
        }

        // 화면에서 넘어온 체크박스 값들을 WasteType 임베디드 객체로 묶기
        WasteType wasteType = new WasteType(
                request.isLightWasting(),
                request.isAcWasting(),
                request.isHeaterWasting(),
                request.isOtherWasting()
        );

        // 엔티티 빌드 (초기 상태는 무조건 'PENDING - 처리중'으로 설정)
        Report report = Report.builder()
                .member(member)
                .building(building)
                .locationDetail(request.roomName())
                .description(request.description())
                .imageUrl(imageUrl)
                .wasteType(wasteType)
                .status(ReportStatus.PENDING)
                .createdAt(LocalDateTime.now())
                .build();

        // 6. DB에 최종 저장 (Insert 쿼리 실행)
        Report savedReport = reportRepository.save(report);

        // 생성된 제보의 고유 식별자(seq) 반환
        return savedReport.getSeq();
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
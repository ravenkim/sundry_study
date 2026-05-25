package org.example.be.service.admin;

import lombok.RequiredArgsConstructor;
import org.example.be.api.response.AdminResponse;
import org.example.be.domain.model.Report;
import org.example.be.domain.model.ReportStatus;
import org.example.be.domain.repository.ReportRepository;
import org.example.be.exception.BusinessLogicException;
import org.example.be.exception.ErrorCode;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AdminReportService {

    private final ReportRepository reportRepository;

    public List<AdminResponse.ReportRow> getReports(Long buildingId) {
        return reportRepository.findAllByOrderByCreatedAtDesc().stream()
                .filter(report -> AdminReportSupport.matchesBuildingFilter(report, buildingId))
                .map(this::toRow)
                .toList();
    }

    @Transactional
    public AdminResponse.ReportRow updateStatus(Long reportId, ReportStatus status) {
        Report report = reportRepository.findById(reportId)
                .orElseThrow(() -> new BusinessLogicException(ErrorCode.NOT_FOUND, "제보를 찾을 수 없습니다."));

        if (status != ReportStatus.APPROVED && status != ReportStatus.REJECTED) {
            throw new BusinessLogicException(ErrorCode.INVALID, "승인 또는 반려만 가능합니다.");
        }

        report.setStatus(status);
        if (status == ReportStatus.APPROVED) {
            int points = report.getEstimatedPoint() != null ? report.getEstimatedPoint() : 0;
            report.setPointAwarded(points);
        } else {
            report.setPointAwarded(0);
        }

        return toRow(report);
    }

    private AdminResponse.ReportRow toRow(Report report) {
        String buildingName = null;
        String roomName = report.getLocationDetail();
        if (report.getLocationNode() != null) {
            buildingName = AdminReportSupport.findRoot(report.getLocationNode()).getName();
            roomName = report.getLocationNode().getName();
        } else if (report.getLocationDetail() != null && report.getLocationDetail().contains(" > ")) {
            String[] parts = report.getLocationDetail().split(" > ");
            buildingName = parts[0];
            roomName = parts[parts.length - 1];
        }

        String memberName = report.getMember() != null
                ? AdminReportSupport.maskMemberName(report.getMember().getUserName())
                : "익명";

        return AdminResponse.ReportRow.builder()
                .reportId(report.getSeq())
                .buildingName(buildingName != null ? buildingName : "미지정")
                .roomName(roomName != null ? roomName : "")
                .locationPath(report.getLocationDetail())
                .memberName(memberName)
                .status(report.getStatus().name())
                .aiResult(AdminReportSupport.buildAiResultSummary(report.getWasteType()))
                .pointAwarded(AdminReportSupport.displayPoints(report))
                .createdAt(report.getCreatedAt() != null ? report.getCreatedAt().toString() : null)
                .imageUrl(report.getImageUrl())
                .build();
    }
}

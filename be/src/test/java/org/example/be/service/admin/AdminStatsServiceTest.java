package org.example.be.service.admin;

import org.example.be.api.response.AdminResponse;
import org.example.be.domain.model.LocationNode;
import org.example.be.domain.model.Report;
import org.example.be.domain.model.ReportStatus;
import org.example.be.domain.model.WasteType;
import org.example.be.domain.repository.ReportRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AdminStatsServiceTest {

    @Mock
    private ReportRepository reportRepository;

    @InjectMocks
    private AdminStatsService adminStatsService;

    @Test
    void getStats_ranksLightWasteRoomsByReportCount() {
        LocationNode engineering303 = leafNode(101L, "303호", rootNode(1L, "공학관 A동"));
        LocationNode engineering201 = leafNode(102L, "201호", rootNode(1L, "공학관 A동"));
        LocationNode library = leafNode(201L, "2열람실", rootNode(2L, "도서관"));

        List<Report> reports = List.of(
                lightReport(engineering303, "공학관 A동 > 303호", LocalDateTime.of(2026, 5, 20, 10, 0)),
                lightReport(engineering303, "공학관 A동 > 303호", LocalDateTime.of(2026, 5, 21, 11, 0)),
                lightReport(engineering303, "공학관 A동 > 303호", LocalDateTime.of(2026, 5, 22, 12, 0)),
                lightReport(engineering201, "공학관 A동 > 201호", LocalDateTime.of(2026, 5, 19, 9, 0)),
                lightReport(library, "도서관 > 2열람실", LocalDateTime.of(2026, 5, 18, 8, 0)),
                rejectedLightReport(engineering201, "공학관 A동 > 201호")
        );

        when(reportRepository.findAllByOrderByCreatedAtDesc()).thenReturn(reports);

        AdminResponse.Stats stats = adminStatsService.getStats(null, null);

        assertThat(stats.getTopLightWasteRooms())
                .extracting(AdminResponse.LightWasteRoom::getRoomName)
                .containsExactly("303호", "201호", "2열람실");
        assertThat(stats.getTopLightWasteRooms().get(0).getReportCount()).isEqualTo(3);
        assertThat(stats.getTopLightWasteRooms().get(0).getLastReportedAt())
                .isEqualTo("2026-05-22T12:00");
    }

    private static LocationNode rootNode(Long seq, String name) {
        LocationNode node = new LocationNode();
        node.setSeq(seq);
        node.setName(name);
        return node;
    }

    private static LocationNode leafNode(Long seq, String name, LocationNode root) {
        LocationNode node = new LocationNode();
        node.setSeq(seq);
        node.setName(name);
        node.setParent(root);
        return node;
    }

    private static Report lightReport(LocationNode locationNode, String locationDetail, LocalDateTime createdAt) {
        Report report = new Report();
        report.setLocationNode(locationNode);
        report.setLocationDetail(locationDetail);
        report.setWasteType(new WasteType(true, false, false, false));
        report.setStatus(ReportStatus.APPROVED);
        report.setCreatedAt(createdAt);
        return report;
    }

    private static Report rejectedLightReport(LocationNode locationNode, String locationDetail) {
        Report report = lightReport(locationNode, locationDetail, LocalDateTime.of(2026, 5, 17, 7, 0));
        report.setStatus(ReportStatus.REJECTED);
        return report;
    }
}

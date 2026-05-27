package org.example.be.service.report;

import org.example.be.domain.model.ReportStatus;
import org.example.be.domain.repository.ReportRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ReportDuplicatePolicyTest {

    @Mock
    private ReportRepository reportRepository;

    @Test
    @DisplayName("REJECTED 제보는 APPROVED 중복 검사에 걸리지 않는다")
    void rejectedReportDoesNotBlockApprovedDuplicateCheck() {
        long memberSeq = 1L;
        long locationSeq = 100L;

        when(reportRepository.existsByMember_SeqAndLocationNode_Seq(memberSeq, locationSeq))
                .thenReturn(true);
        when(reportRepository.existsByMember_SeqAndLocationNode_SeqAndStatus(
                memberSeq, locationSeq, ReportStatus.APPROVED)).thenReturn(false);

        assertThat(reportRepository.existsByMember_SeqAndLocationNode_Seq(memberSeq, locationSeq))
                .isTrue();
        assertThat(reportRepository.existsByMember_SeqAndLocationNode_SeqAndStatus(
                memberSeq, locationSeq, ReportStatus.APPROVED)).isFalse();
    }

    @Test
    @DisplayName("APPROVED 제보는 동일 member+location 중복 검사에 걸린다")
    void approvedReportBlocksDuplicateCheck() {
        long memberSeq = 2L;
        long locationSeq = 200L;

        when(reportRepository.existsByMember_SeqAndLocationNode_SeqAndStatus(
                memberSeq, locationSeq, ReportStatus.APPROVED)).thenReturn(true);

        assertThat(reportRepository.existsByMember_SeqAndLocationNode_SeqAndStatus(
                memberSeq, locationSeq, ReportStatus.APPROVED)).isTrue();
    }
}

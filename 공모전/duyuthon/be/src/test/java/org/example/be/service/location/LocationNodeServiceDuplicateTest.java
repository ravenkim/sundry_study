package org.example.be.service.location;

import org.example.be.domain.model.Affiliation;
import org.example.be.domain.model.LocationNode;
import org.example.be.domain.model.NodeKind;
import org.example.be.domain.model.ReportStatus;
import org.example.be.domain.repository.AffiliationRepository;
import org.example.be.domain.repository.LocationNodeRepository;
import org.example.be.domain.repository.LocationOperatingScheduleRepository;
import org.example.be.domain.repository.ReportRepository;
import org.example.be.service.savings.SavingsCalculationService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class LocationNodeServiceDuplicateTest {

    private static final Long AFFILIATION_ID = 1L;
    private static final Long MEMBER_SEQ = 99L;
    private static final Long ROOT_ID = 10L;
    private static final Long LEAF_ID = 20L;

    @Mock
    private LocationNodeRepository locationNodeRepository;

    @Mock
    private LocationOperatingScheduleRepository operatingScheduleRepository;

    @Mock
    private AffiliationRepository affiliationRepository;

    @Mock
    private ReportRepository reportRepository;

    @Mock
    private SavingsCalculationService savingsCalculationService;

    @InjectMocks
    private LocationNodeService locationNodeService;

    private Affiliation affiliation;
    private LocationNode root;
    private LocationNode leaf;

    @BeforeEach
    void setUp() {
        affiliation = Affiliation.builder().name("테스트대").build();
        affiliation.setSeq(AFFILIATION_ID);

        root = LocationNode.builder()
                .affiliation(affiliation)
                .name("공학관")
                .nodeKind(NodeKind.GROUP)
                .depth(1)
                .sortOrder(0)
                .build();
        root.setSeq(ROOT_ID);

        leaf = LocationNode.builder()
                .affiliation(affiliation)
                .parent(root)
                .name("303호")
                .nodeKind(NodeKind.LEAF)
                .depth(2)
                .sortOrder(0)
                .build();
        leaf.setSeq(LEAF_ID);

        when(locationNodeRepository.findByAffiliation_SeqAndParentIsNullOrderBySortOrderAscSeqAsc(
                AFFILIATION_ID)).thenReturn(List.of(root));
        when(locationNodeRepository.findByParent_SeqOrderBySortOrderAscSeqAsc(ROOT_ID))
                .thenReturn(List.of(leaf));
        when(operatingScheduleRepository.findByLocationNode_SeqOrderByDayOfWeekAsc(LEAF_ID))
                .thenReturn(List.of());
        when(savingsCalculationService.isReportableAt(any(), any())).thenReturn(true);
    }

    @Test
    @DisplayName("alreadyReported는 APPROVED 제보만 조회한다")
    void alreadyReportedChecksApprovedStatusOnly() {
        when(reportRepository.existsByMember_SeqAndLocationNode_SeqAndStatus(
                MEMBER_SEQ, LEAF_ID, ReportStatus.APPROVED)).thenReturn(true);

        var trees = locationNodeService.listPublicTrees(AFFILIATION_ID, MEMBER_SEQ);

        verify(reportRepository).existsByMember_SeqAndLocationNode_SeqAndStatus(
                MEMBER_SEQ, LEAF_ID, ReportStatus.APPROVED);
        verify(reportRepository, never()).existsByMember_SeqAndLocationNode_Seq(
                eq(MEMBER_SEQ), eq(LEAF_ID));
        assertThat(trees).hasSize(1);
        assertThat(trees.get(0).getChildren()).hasSize(1);
        assertThat(trees.get(0).getChildren().get(0).getAlreadyReported()).isTrue();
    }

    @Test
    @DisplayName("REJECTED만 있으면 alreadyReported는 false")
    void alreadyReportedFalseWhenNoApprovedReport() {
        when(reportRepository.existsByMember_SeqAndLocationNode_SeqAndStatus(
                MEMBER_SEQ, LEAF_ID, ReportStatus.APPROVED)).thenReturn(false);

        var trees = locationNodeService.listPublicTrees(AFFILIATION_ID, MEMBER_SEQ);

        assertThat(trees.get(0).getChildren().get(0).getAlreadyReported()).isFalse();
    }
}

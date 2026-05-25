package org.example.be.service.affiliation;

import org.example.be.api.response.AffiliationResponse;
import org.example.be.domain.model.Affiliation;
import org.example.be.domain.repository.AffiliationRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AffiliationServiceTest {

    @Mock
    private AffiliationRepository affiliationRepository;

    @InjectMocks
    private AffiliationService affiliationService;

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(affiliationService, "defaultAffiliationName", "삼육대학교");
    }

    @Test
    void listAffiliations_returnsDefaultAffiliationIdFromConfig() {
        Affiliation sahmook = affiliation(1L, "삼육대학교");
        Affiliation other = affiliation(2L, "다른대학교");

        when(affiliationRepository.findAll()).thenReturn(List.of(sahmook, other));
        when(affiliationRepository.findByName("삼육대학교")).thenReturn(Optional.of(sahmook));

        AffiliationResponse.ListPayload payload = affiliationService.listAffiliations();

        assertThat(payload.getDefaultAffiliationId()).isEqualTo(1L);
        assertThat(payload.getItems()).hasSize(2);
    }

    @Test
    void resolveDefaultAffiliation_usesConfiguredName() {
        Affiliation sahmook = affiliation(1L, "삼육대학교");

        when(affiliationRepository.findAll()).thenReturn(List.of(sahmook));
        when(affiliationRepository.findByName("삼육대학교")).thenReturn(Optional.of(sahmook));

        assertThat(affiliationService.resolveDefaultAffiliation().getSeq()).isEqualTo(1L);
    }

    private static Affiliation affiliation(Long seq, String name) {
        Affiliation affiliation = new Affiliation();
        affiliation.setSeq(seq);
        affiliation.setName(name);
        return affiliation;
    }
}

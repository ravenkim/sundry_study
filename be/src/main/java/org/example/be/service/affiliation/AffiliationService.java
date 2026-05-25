package org.example.be.service.affiliation;

import lombok.RequiredArgsConstructor;
import org.example.be.api.response.AffiliationResponse;
import org.example.be.domain.model.Affiliation;
import org.example.be.domain.repository.AffiliationRepository;
import org.example.be.exception.BusinessLogicException;
import org.example.be.exception.ErrorCode;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AffiliationService {

    private final AffiliationRepository affiliationRepository;

    @Value("${app.affiliation.default-name:}")
    private String defaultAffiliationName;

    public AffiliationResponse.ListPayload listAffiliations() {
        List<Affiliation> affiliations = affiliationRepository.findAll();
        Long defaultAffiliationId = resolveDefaultAffiliationId(affiliations).orElse(null);

        List<AffiliationResponse.Item> items = affiliations.stream()
                .map(AffiliationResponse.Item::of)
                .toList();

        return AffiliationResponse.ListPayload.builder()
                .defaultAffiliationId(defaultAffiliationId)
                .items(items)
                .build();
    }

    public Affiliation resolveDefaultAffiliation() {
        List<Affiliation> affiliations = affiliationRepository.findAll();
        return resolveDefaultAffiliationId(affiliations)
                .flatMap(id -> affiliations.stream()
                        .filter(affiliation -> affiliation.getSeq().equals(id))
                        .findFirst())
                .orElseThrow(() -> new BusinessLogicException(
                        ErrorCode.INVALID,
                        "기본 소속이 설정되지 않았습니다."
                ));
    }

    private Optional<Long> resolveDefaultAffiliationId(List<Affiliation> affiliations) {
        if (defaultAffiliationName != null && !defaultAffiliationName.isBlank()) {
            return affiliationRepository.findByName(defaultAffiliationName.trim())
                    .map(Affiliation::getSeq);
        }
        if (affiliations.size() == 1) {
            return Optional.of(affiliations.get(0).getSeq());
        }
        return Optional.empty();
    }
}

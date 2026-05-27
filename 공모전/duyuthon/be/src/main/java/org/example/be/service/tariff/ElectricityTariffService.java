package org.example.be.service.tariff;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.be.domain.model.ElectricityTariff;
import org.example.be.domain.repository.ElectricityTariffRepository;
import org.example.be.service.savings.EnergyConstants;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class ElectricityTariffService {

    private final ElectricityTariffRepository electricityTariffRepository;
    private final KepcoOpenApiClient kepcoOpenApiClient;

    @Value("${app.kepco.contract-type-code:400}")
    private String contractTypeCode;

    @Value("${app.kepco.contract-type-name:교육용}")
    private String contractTypeName;

    public BigDecimal getEffectiveUnitCostKrw() {
        return findLatestTariff()
                .map(ElectricityTariff::getUnitCostKrw)
                .orElse(BigDecimal.valueOf(EnergyConstants.ELECTRICITY_RATE_KRW));
    }

    public int getEffectiveUnitCostKrwInt() {
        return getEffectiveUnitCostKrw()
                .setScale(0, RoundingMode.HALF_UP)
                .intValue();
    }

    public Optional<ElectricityTariff> findLatestTariff() {
        return electricityTariffRepository.findTopByContractTypeCodeOrderByYearMonthDesc(contractTypeCode);
    }

    @Transactional
    public void syncRecentMonths() {
        if (!kepcoOpenApiClient.isConfigured()) {
            log.debug("KEPCO API 키 미설정 — 전기 단가 동기화 생략 (기본값 {}원/kWh 사용)",
                    EnergyConstants.ELECTRICITY_RATE_KRW);
            return;
        }

        YearMonth current = YearMonth.now();
        syncMonth(current.minusMonths(1));
        syncMonth(current.minusMonths(2));
    }

    @Transactional
    public boolean syncMonth(YearMonth yearMonth) {
        String yearMonthKey = formatYearMonth(yearMonth);
        if (electricityTariffRepository.existsByYearMonthAndContractTypeCode(yearMonthKey, contractTypeCode)) {
            return false;
        }

        Optional<KepcoContractTypeItem> itemOpt = kepcoOpenApiClient.fetchContractTypeUsage(yearMonth, contractTypeCode);
        if (itemOpt.isEmpty()) {
            return false;
        }

        KepcoContractTypeItem item = itemOpt.get();
        ElectricityTariff tariff = ElectricityTariff.builder()
                .yearMonth(yearMonthKey)
                .contractTypeCode(contractTypeCode)
                .contractTypeName(resolveContractTypeName(item))
                .unitCostKrw(BigDecimal.valueOf(item.getUnitCostKrw()).setScale(2, RoundingMode.HALF_UP))
                .powerUsageKwh(item.getPowerUsageKwh())
                .billKrw(item.getBill())
                .custCount(item.getCustCount() != null ? item.getCustCount().intValue() : null)
                .fetchedAt(LocalDateTime.now())
                .build();

        electricityTariffRepository.save(tariff);
        log.info("전기 단가 동기화 완료 — {} {}원/kWh ({} / cntrCd={})",
                yearMonthKey, tariff.getUnitCostKrw(), tariff.getContractTypeName(), contractTypeCode);
        return true;
    }

    private String resolveContractTypeName(KepcoContractTypeItem item) {
        if (item.getContractTypeName() != null && !item.getContractTypeName().isBlank()) {
            return item.getContractTypeName();
        }
        return contractTypeName;
    }

    static String formatYearMonth(YearMonth yearMonth) {
        return String.format("%04d-%02d", yearMonth.getYear(), yearMonth.getMonthValue());
    }
}

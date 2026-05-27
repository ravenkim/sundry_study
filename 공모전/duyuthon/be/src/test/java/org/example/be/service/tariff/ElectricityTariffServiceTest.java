package org.example.be.service.tariff;

import org.example.be.domain.model.ElectricityTariff;
import org.example.be.domain.repository.ElectricityTariffRepository;
import org.example.be.service.savings.EnergyConstants;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ElectricityTariffServiceTest {

    @Mock
    private ElectricityTariffRepository electricityTariffRepository;

    @Mock
    private KepcoOpenApiClient kepcoOpenApiClient;

    private ElectricityTariffService service;

    @BeforeEach
    void setUp() {
        service = new ElectricityTariffService(electricityTariffRepository, kepcoOpenApiClient);
        ReflectionTestUtils.setField(service, "contractTypeCode", "400");
        ReflectionTestUtils.setField(service, "contractTypeName", "교육용");
    }

    @Test
    @DisplayName("DB에 단가 없으면 EnergyConstants 기본값 사용")
    void fallbackToDefaultWhenNoTariff() {
        when(electricityTariffRepository.findTopByContractTypeCodeOrderByYearMonthDesc("400"))
                .thenReturn(Optional.empty());

        assertThat(service.getEffectiveUnitCostKrwInt()).isEqualTo(EnergyConstants.ELECTRICITY_RATE_KRW);
    }

    @Test
    @DisplayName("DB 최신 단가를 절약 계산에 사용")
    void useLatestTariffFromDb() {
        ElectricityTariff latest = ElectricityTariff.builder()
                .yearMonth("2025-12")
                .contractTypeCode("400")
                .contractTypeName("교육용")
                .unitCostKrw(new BigDecimal("102.10"))
                .fetchedAt(LocalDateTime.now())
                .build();

        when(electricityTariffRepository.findTopByContractTypeCodeOrderByYearMonthDesc("400"))
                .thenReturn(Optional.of(latest));

        assertThat(service.getEffectiveUnitCostKrwInt()).isEqualTo(102);
    }

    @Test
    @DisplayName("한전 API 응답을 월별 단가로 저장")
    void syncMonthPersistsApiResponse() {
        YearMonth target = YearMonth.of(2024, 12);
        KepcoContractTypeItem item = new KepcoContractTypeItem();
        item.setContractTypeName("교육용");
        item.setUnitCostKrw(115.6);
        item.setPowerUsageKwh(1000L);
        item.setBill(115600L);
        item.setCustCount(10L);

        when(electricityTariffRepository.existsByYearMonthAndContractTypeCode("2024-12", "400"))
                .thenReturn(false);
        when(kepcoOpenApiClient.fetchContractTypeUsage(target, "400"))
                .thenReturn(Optional.of(item));

        boolean synced = service.syncMonth(target);

        assertThat(synced).isTrue();

        ArgumentCaptor<ElectricityTariff> captor = ArgumentCaptor.forClass(ElectricityTariff.class);
        verify(electricityTariffRepository).save(captor.capture());

        ElectricityTariff saved = captor.getValue();
        assertThat(saved.getYearMonth()).isEqualTo("2024-12");
        assertThat(saved.getUnitCostKrw()).isEqualByComparingTo("115.60");
        assertThat(saved.getContractTypeName()).isEqualTo("교육용");
    }

    @Test
    @DisplayName("이미 저장된 월은 재수집하지 않음")
    void skipExistingMonth() {
        YearMonth target = YearMonth.of(2024, 11);
        when(electricityTariffRepository.existsByYearMonthAndContractTypeCode("2024-11", "400"))
                .thenReturn(true);

        boolean synced = service.syncMonth(target);

        assertThat(synced).isFalse();
        verify(kepcoOpenApiClient, never()).fetchContractTypeUsage(any(), eq("400"));
    }
}

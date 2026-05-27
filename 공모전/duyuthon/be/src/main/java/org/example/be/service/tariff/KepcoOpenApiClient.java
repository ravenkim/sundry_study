package org.example.be.service.tariff;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.time.YearMonth;
import java.util.Optional;

@Slf4j
@Component
public class KepcoOpenApiClient {

    private static final String CONTRACT_TYPE_URL =
            "https://bigdata.kepco.co.kr/openapi/v1/powerUsage/contractType.do";

    private final RestTemplate restTemplate;
    private final String apiKey;

    public KepcoOpenApiClient(
            RestTemplate restTemplate,
            @Value("${app.kepco.api-key:}") String apiKey
    ) {
        this.restTemplate = restTemplate;
        this.apiKey = apiKey == null ? "" : apiKey.trim();
    }

    public boolean isConfigured() {
        return !apiKey.isBlank();
    }

    public Optional<KepcoContractTypeItem> fetchContractTypeUsage(
            YearMonth yearMonth,
            String contractTypeCode
    ) {
        if (!isConfigured()) {
            return Optional.empty();
        }

        String url = UriComponentsBuilder.fromUriString(CONTRACT_TYPE_URL)
                .queryParam("year", String.valueOf(yearMonth.getYear()))
                .queryParam("month", String.format("%02d", yearMonth.getMonthValue()))
                .queryParam("cntrCd", contractTypeCode)
                .queryParam("apiKey", apiKey)
                .queryParam("returnType", "json")
                .build()
                .encode()
                .toUriString();

        try {
            KepcoContractTypeResponse response = restTemplate.getForObject(url, KepcoContractTypeResponse.class);
            if (response == null) {
                log.warn("한전 API 응답 없음 — {} / cntrCd={}", yearMonth, contractTypeCode);
                return Optional.empty();
            }

            return response.resolveItems().stream()
                    .filter(item -> item.getUnitCostKrw() != null && item.getUnitCostKrw() > 0)
                    .findFirst();
        } catch (RestClientException e) {
            log.warn("한전 API 호출 실패 — {} / cntrCd={}: {}", yearMonth, contractTypeCode, e.getMessage());
            return Optional.empty();
        }
    }
}

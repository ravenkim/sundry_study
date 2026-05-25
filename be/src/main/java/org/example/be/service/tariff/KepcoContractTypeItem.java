package org.example.be.service.tariff;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@JsonIgnoreProperties(ignoreUnknown = true)
public class KepcoContractTypeItem {

    private String year;
    private String month;
    private String metro;
    private String city;

    @JsonProperty("cntr")
    private String contractTypeName;

    @JsonProperty("custCnt")
    private Long custCount;

    @JsonProperty("powerUsage")
    private Long powerUsageKwh;

    private Long bill;

    @JsonProperty("unitCost")
    private Double unitCostKrw;

    @JsonProperty("cntrPwr")
    private Long contractPower;
}

package org.example.be.domain.model;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "electricity_tariff_db")
@Getter
@Setter
@NoArgsConstructor
public class ElectricityTariff {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long seq;

    @Column(name = "year_month", nullable = false, length = 7)
    private String yearMonth;

    @Column(name = "contract_type_code", nullable = false, length = 10)
    private String contractTypeCode;

    @Column(name = "contract_type_name", nullable = false, length = 50)
    private String contractTypeName;

    @Column(name = "unit_cost_krw", nullable = false, precision = 10, scale = 2)
    private BigDecimal unitCostKrw;

    @Column(name = "power_usage_kwh")
    private Long powerUsageKwh;

    @Column(name = "bill_krw")
    private Long billKrw;

    @Column(name = "cust_count")
    private Integer custCount;

    @Column(name = "fetched_at", nullable = false)
    private LocalDateTime fetchedAt;

    @Builder
    public ElectricityTariff(
            String yearMonth,
            String contractTypeCode,
            String contractTypeName,
            BigDecimal unitCostKrw,
            Long powerUsageKwh,
            Long billKrw,
            Integer custCount,
            LocalDateTime fetchedAt
    ) {
        this.yearMonth = yearMonth;
        this.contractTypeCode = contractTypeCode;
        this.contractTypeName = contractTypeName;
        this.unitCostKrw = unitCostKrw;
        this.powerUsageKwh = powerUsageKwh;
        this.billKrw = billKrw;
        this.custCount = custCount;
        this.fetchedAt = fetchedAt;
    }
}

package org.example.be.domain.repository;

import org.example.be.domain.model.ElectricityTariff;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ElectricityTariffRepository extends JpaRepository<ElectricityTariff, Long> {

    Optional<ElectricityTariff> findTopByContractTypeCodeOrderByYearMonthDesc(String contractTypeCode);

    boolean existsByYearMonthAndContractTypeCode(String yearMonth, String contractTypeCode);
}

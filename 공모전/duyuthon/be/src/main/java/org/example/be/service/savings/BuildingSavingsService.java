package org.example.be.service.savings;

import lombok.RequiredArgsConstructor;
import org.example.be.api.response.BuildingSavingsResponse;
import org.example.be.domain.model.LocationNode;
import org.example.be.domain.model.Report;
import org.example.be.domain.model.ReportStatus;
import org.example.be.domain.repository.ReportRepository;
import org.example.be.service.tariff.ElectricityTariffService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class BuildingSavingsService {

    private static final List<ReportStatus> AGGREGATE_STATUSES = List.of(
            ReportStatus.PENDING,
            ReportStatus.APPROVED
    );

    private final ReportRepository reportRepository;
    private final ElectricityTariffService electricityTariffService;

    public List<BuildingSavingsResponse.Item> getMyBuildingSavings(Long memberSeq) {
        List<Report> reports = reportRepository.findByMember_SeqAndStatusIn(
                memberSeq,
                AGGREGATE_STATUSES
        );

        YearMonth currentMonth = YearMonth.now();
        var unitCostKrw = electricityTariffService.getEffectiveUnitCostKrw();
        Map<Long, BuildingAccumulator> accumulators = new HashMap<>();

        for (Report report : reports) {
            if (report.getLocationNode() == null) {
                continue;
            }

            BigDecimal resolvedKwh = EstimatedKwhResolver.resolve(
                    report.getEstimatedKwh(),
                    report.getEstimatedSavingsKrw(),
                    unitCostKrw
            );
            if (resolvedKwh.compareTo(BigDecimal.ZERO) <= 0) {
                continue;
            }

            LocationNode root = findRoot(report.getLocationNode());
            double kwh = resolvedKwh.doubleValue();

            BuildingAccumulator acc = accumulators.computeIfAbsent(
                    root.getSeq(),
                    id -> new BuildingAccumulator(root.getSeq(), root.getName())
            );
            acc.totalKwh += kwh;
            acc.reportCount++;

            if (isInMonth(report.getCreatedAt().toLocalDate(), currentMonth)) {
                acc.thisMonthKwh += kwh;
            }
        }

        List<BuildingSavingsResponse.Item> items = new ArrayList<>();
        for (BuildingAccumulator acc : accumulators.values()) {
            items.add(BuildingSavingsResponse.Item.builder()
                    .buildingId(acc.buildingId)
                    .buildingName(acc.buildingName)
                    .totalKwh(roundKwh(acc.totalKwh))
                    .thisMonthKwh(roundKwh(acc.thisMonthKwh))
                    .reportCount(acc.reportCount)
                    .build());
        }

        items.sort(Comparator.comparing(BuildingSavingsResponse.Item::getTotalKwh).reversed());
        return items;
    }

    private boolean isInMonth(LocalDate date, YearMonth month) {
        return date != null && YearMonth.from(date).equals(month);
    }

    private double roundKwh(double value) {
        return Math.round(value * 10.0) / 10.0;
    }

    private LocationNode findRoot(LocationNode node) {
        LocationNode current = node;
        while (current.getParent() != null) {
            current = current.getParent();
        }
        return current;
    }

    private static class BuildingAccumulator {
        private final Long buildingId;
        private final String buildingName;
        private double totalKwh;
        private double thisMonthKwh;
        private int reportCount;

        private BuildingAccumulator(Long buildingId, String buildingName) {
            this.buildingId = buildingId;
            this.buildingName = buildingName;
        }
    }
}

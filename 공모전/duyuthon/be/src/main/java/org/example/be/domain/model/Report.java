package org.example.be.domain.model;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "report_db")
@Getter
@Setter
@NoArgsConstructor
public class Report {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long seq;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_seq")
    private Member member;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "location_seq")
    private LocationNode locationNode;

    @Column(nullable = false)
    private String locationDetail;

    @Column(length = 1000)
    private String description;

    private String imageUrl;

    @Embedded
    private WasteType wasteType;

    @Enumerated(EnumType.STRING)
    private ReportStatus status;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "off_time_minutes")
    private Integer offTimeMinutes;

    @Column(name = "estimated_kwh", precision = 10, scale = 4)
    private BigDecimal estimatedKwh;

    @Column(name = "estimated_savings_krw")
    private Integer estimatedSavingsKrw;

    @Column(name = "estimated_point")
    private Integer estimatedPoint;

    @Column(name = "point_awarded")
    private Integer pointAwarded = 0;

    @Builder
    public Report(
            Member member,
            LocationNode locationNode,
            String locationDetail,
            String description,
            String imageUrl,
            WasteType wasteType,
            ReportStatus status,
            LocalDateTime createdAt,
            Integer offTimeMinutes,
            BigDecimal estimatedKwh,
            Integer estimatedSavingsKrw,
            Integer estimatedPoint,
            Integer pointAwarded
    ) {
        this.member = member;
        this.locationNode = locationNode;
        this.locationDetail = locationDetail;
        this.description = description;
        this.imageUrl = imageUrl;
        this.wasteType = wasteType;
        this.status = status;
        this.createdAt = createdAt;
        this.offTimeMinutes = offTimeMinutes;
        this.estimatedKwh = estimatedKwh;
        this.estimatedSavingsKrw = estimatedSavingsKrw;
        this.estimatedPoint = estimatedPoint;
        this.pointAwarded = pointAwarded != null ? pointAwarded : 0;
    }
}

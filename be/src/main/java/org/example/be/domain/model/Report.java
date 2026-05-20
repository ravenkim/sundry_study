package org.example.be.domain.model;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
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
    private Member member; // 제보한 회원

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "building_seq")
    private Building building; // 선택한 건물 (예: 공학관 A동)

    @Column(nullable = false)
    private String locationDetail; // 사용자가 직접 입력한 상세 장소 (예: 303호, 2층 복도 우측)

    @Column(length = 1000)
    private String description; //제보 사항 상세 설명

    private String imageUrl; // 제보 사진 URL

    @Embedded
    private WasteType wasteType; // 어떤 종류의 낭비인지 선택 항목 저장 (아래 구현 참고)

    @Enumerated(EnumType.STRING)
    private ReportStatus status; // PENDING(처리중), APPROVED(승인됨), REJECTED(반려됨)

    private LocalDateTime createdAt; // 제보 일시

    @Builder
    public Report(Member member, Building building, String locationDetail, String description, String imageUrl,
                  WasteType wasteType, ReportStatus status, LocalDateTime createdAt) {
        this.member = member;
        this.building = building;
        this.locationDetail = locationDetail;
        this.description = description;
        this.imageUrl = imageUrl;
        this.wasteType = wasteType;
        this.status = status;
        this.createdAt = createdAt;
    }
}
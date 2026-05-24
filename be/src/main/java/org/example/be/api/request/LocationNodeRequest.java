package org.example.be.api.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import org.example.be.domain.model.NodeKind;

import java.time.LocalTime;
import java.util.List;

public class LocationNodeRequest {

    @Getter
    @Setter
    public static class OperatingScheduleItem {
        @NotNull(message = "요일을 지정해 주세요.")
        private Integer dayOfWeek;

        private Boolean closed;

        private LocalTime powerOnTime;

        private LocalTime powerOffTime;
    }

    @Getter
    @Setter
    public static class Create {
        private Long parentId;

        @NotNull(message = "소속을 선택해 주세요.")
        private Long affiliationId;

        @NotBlank(message = "이름을 입력해 주세요.")
        private String name;

        @NotNull(message = "노드 유형을 선택해 주세요.")
        private NodeKind nodeKind;

        /** LEAF(항목) 등록 시 — 에어컨 대수 */
        @Min(value = 0, message = "에어컨 대수는 0 이상이어야 합니다.")
        private Integer acCount;

        /** LEAF(항목) 등록 시 — 형광등 개수 */
        @Min(value = 0, message = "형광등 개수는 0 이상이어야 합니다.")
        private Integer fluorescentCount;

        /** LEAF(항목) 등록 시 — LED 조명 개수 */
        @Min(value = 0, message = "LED 조명 개수는 0 이상이어야 합니다.")
        private Integer ledCount;

        /** LEAF(항목) — 요일별 운영시간 (7일). null이면 기본값 적용 */
        private List<OperatingScheduleItem> operatingSchedules;
    }

    @Getter
    @Setter
    public static class Update {
        @NotBlank(message = "이름을 입력해 주세요.")
        private String name;

        private Integer sortOrder;

        @Min(value = 0, message = "에어컨 대수는 0 이상이어야 합니다.")
        private Integer acCount;

        @Min(value = 0, message = "형광등 개수는 0 이상이어야 합니다.")
        private Integer fluorescentCount;

        @Min(value = 0, message = "LED 조명 개수는 0 이상이어야 합니다.")
        private Integer ledCount;

        /** LEAF(항목) — 요일별 운영시간 (7일) */
        private List<OperatingScheduleItem> operatingSchedules;
    }
}

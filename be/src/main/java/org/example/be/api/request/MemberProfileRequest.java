package org.example.be.api.request;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

public class MemberProfileRequest {

    @Getter
    @Setter
    public static class AssignBuilding {
        @NotNull(message = "소속 건물을 선택해 주세요.")
        private Long buildingId;
    }

    @Getter
    @Setter
    public static class AssignAffiliation {
        @NotNull(message = "소속을 선택해 주세요.")
        private Long affiliationId;

        private Long buildingId;
    }
}

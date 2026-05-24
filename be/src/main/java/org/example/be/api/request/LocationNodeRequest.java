package org.example.be.api.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import org.example.be.domain.model.NodeKind;

public class LocationNodeRequest {

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
    }

    @Getter
    @Setter
    public static class Update {
        @NotBlank(message = "이름을 입력해 주세요.")
        private String name;

        private Integer sortOrder;
    }
}

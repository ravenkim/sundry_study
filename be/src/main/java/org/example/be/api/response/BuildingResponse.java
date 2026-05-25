package org.example.be.api.response;

import lombok.Builder;
import lombok.Getter;
import org.example.be.domain.model.NodeKind;

import java.util.List;

public class BuildingResponse {

    @Getter
    @Builder
    public static class TreeNode {
        private Long locationId;
        private String name;
        private NodeKind nodeKind;
        /** 운영 시간 외(제보 가능 시간) 여부 — LEAF만 설정 */
        private Boolean reportable;
        /** 로그인 회원이 이미 제보한 장소 — LEAF + 인증 시만 설정 */
        private Boolean alreadyReported;
        private List<TreeNode> children;
    }

    @Getter
    @Builder
    public static class Item {
        private Long buildingId;
        private String name;
        private NodeKind nodeKind;
        private Long affiliationId;
        private String affiliationName;
        private List<TreeNode> children;
    }
}

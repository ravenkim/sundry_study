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

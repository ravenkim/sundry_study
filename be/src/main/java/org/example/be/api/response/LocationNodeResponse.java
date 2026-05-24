package org.example.be.api.response;

import lombok.Builder;
import lombok.Getter;
import org.example.be.domain.model.NodeKind;

import java.util.List;

public class LocationNodeResponse {

    @Getter
    @Builder
    public static class TreeNode {
        private Long id;
        private String name;
        private NodeKind nodeKind;
        private int depth;
        private int sortOrder;
        private String locationType;
        private List<TreeNode> children;
    }
}

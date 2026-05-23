package org.example.be.api.response;

import lombok.Builder;
import lombok.Getter;
import org.example.be.domain.model.Affiliation;

public class AffiliationResponse {

    @Getter
    @Builder
    public static class Item {
        private Long affiliationId;
        private String name;
        private String address;

        public static Item of(Affiliation affiliation) {
            return Item.builder()
                    .affiliationId(affiliation.getSeq())
                    .name(affiliation.getName())
                    .address(affiliation.getAddress())
                    .build();
        }
    }
}

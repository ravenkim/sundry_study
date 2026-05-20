package org.example.be.domain.model;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class WasteType {

    private boolean isLightWasting;  // 조명 켜짐 여부 (true/false)
    private boolean isAcWasting;     // 에어컨 공회전 여부 (true/false)
    private boolean isHeaterWasting; // 히터 공회전 여부 (true/false)
    private boolean isOtherWasting;  // 기타 낭비 여부 (true/false)

    public WasteType(boolean lightWasting, boolean acWasting, boolean otherWasting) {
    }
}
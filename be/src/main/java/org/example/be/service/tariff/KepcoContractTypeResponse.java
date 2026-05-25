package org.example.be.service.tariff;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Getter;
import lombok.Setter;

import java.util.Collections;
import java.util.List;

@Getter
@Setter
@JsonIgnoreProperties(ignoreUnknown = true)
public class KepcoContractTypeResponse {

    private List<KepcoContractTypeItem> data;
    private List<KepcoContractTypeItem> totData;

    public List<KepcoContractTypeItem> resolveItems() {
        if (totData != null && !totData.isEmpty()) {
            return totData;
        }
        if (data != null && !data.isEmpty()) {
            return data;
        }
        return Collections.emptyList();
    }
}

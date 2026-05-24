package org.example.be.api.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PointExchangeRequest {

    @NotNull
    private Long rewardId;

    @Min(1)
    private int quantity = 1;
}

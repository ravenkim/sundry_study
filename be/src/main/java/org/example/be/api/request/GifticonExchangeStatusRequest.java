package org.example.be.api.request;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import org.example.be.domain.model.GifticonExchangeStatus;

@Getter
@Setter
public class GifticonExchangeStatusRequest {

    @NotNull
    private GifticonExchangeStatus status;
}

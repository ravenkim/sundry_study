package org.example.be.api.request;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import org.example.be.domain.model.ReportStatus;

@Getter
@Setter
public class AdminReportStatusRequest {

    @NotNull
    private ReportStatus status;
}

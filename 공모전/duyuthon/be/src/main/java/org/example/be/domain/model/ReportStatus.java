package org.example.be.domain.model;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum ReportStatus {
    PENDING("확인 필요"),
    APPROVED("적립 완료"),
    REJECTED("반려됨");

    private final String description;
}
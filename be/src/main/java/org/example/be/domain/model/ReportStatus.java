package org.example.be.domain.model;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum ReportStatus {
    PENDING("처리중"),
    APPROVED("승인됨"),
    REJECTED("반려됨");

    private final String description;
}
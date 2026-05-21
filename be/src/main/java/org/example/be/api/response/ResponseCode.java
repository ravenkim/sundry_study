package org.example.be.api.response;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum ResponseCode {
    OK(10000),
    LOGIN_SUCCESS(10001),
    REGISTER_SUCCESS(10002),
    REPORT_CREATED(10003),
    BUILDINGS_LIST(10004),
    POINTS_ME(10005),
    REPORTS_LIST(10006),
    REPORT_DETAIL(10007);
    private final int code;
}

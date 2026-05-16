package org.example.be.api.response;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum ResponseCode {
    OK(10000),
    LOGIN_SUCCESS(10001),
    REGISTER_SUCCESS(10002);
    private final int code;
}

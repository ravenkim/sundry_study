package org.example.be.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum ErrorCode {
    LOGIN_REQUIRED(1003),
    FILE_NOT_ALLOWED(1004),
    INVALID(1005),
    NO_PERMISSION(1011),
    NOT_CORRECT(2001),
    MEMBER_EXISTS(2002),
    NOT_FOUND(2003),
    ALREADY_EXISTS(2004),
    DB_ERROR(5001),
    MULTIPART_ERROR(5002);
    private final int code;
    private String message;
}

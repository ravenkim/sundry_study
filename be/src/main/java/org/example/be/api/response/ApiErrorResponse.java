package org.example.be.api.response;

import org.example.be.exception.ErrorCode;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ApiErrorResponse {
    private int code;
    private String message;

    public static ApiErrorResponse fail(ErrorCode code, String message) {
        return ApiErrorResponse.builder().code(code.getCode()).message(message).build();
    }

    public static ApiErrorResponse fail(ErrorCode code) {
        return ApiErrorResponse.fail(code, code.getMessage());
    }
}
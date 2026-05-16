package org.example.be.api.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ApiResponse<T> {
    private int code;
    private T body;

    public static <T> ApiResponse<T> success(ResponseCode code, T body) {
        return ApiResponse.<T>builder()
                .code(code.getCode())
                .body(body)
                .build();
    }

    public static <T> ApiResponse<T> success(ResponseCode code) {
        return ApiResponse.<T>builder()
                .code(code.getCode())
                .build();
    }
}

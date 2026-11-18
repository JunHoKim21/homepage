package com.starterkit.common.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import java.time.OffsetDateTime;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record ApiResponse<T>(
        boolean success,
        String code,
        String message,
        T data,
        OffsetDateTime timestamp
) {
    public static <T> ApiResponse<T> ok(T data) {
        return new ApiResponse<>(true, "SUCCESS", "요청이 정상 처리되었습니다.", data, OffsetDateTime.now());
    }

    public static <T> ApiResponse<T> ok(String message, T data) {
        return new ApiResponse<>(true, "SUCCESS", message, data, OffsetDateTime.now());
    }

    public static ApiResponse<Void> ok() {
        return new ApiResponse<>(true, "SUCCESS", "요청이 정상 처리되었습니다.", null, OffsetDateTime.now());
    }

    public static ApiResponse<Void> error(String code, String message) {
        return new ApiResponse<>(false, code, message, null, OffsetDateTime.now());
    }
}

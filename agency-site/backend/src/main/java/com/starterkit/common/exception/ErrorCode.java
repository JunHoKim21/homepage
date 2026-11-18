package com.starterkit.common.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum ErrorCode {
    // Common
    INVALID_INPUT(HttpStatus.BAD_REQUEST, "COMMON_001", "입력값이 올바르지 않습니다."),
    RESOURCE_NOT_FOUND(HttpStatus.NOT_FOUND, "COMMON_002", "요청하신 리소스를 찾을 수 없습니다."),
    SYSTEM_LOCKED_RESOURCE(HttpStatus.FORBIDDEN, "COMMON_003", "필수 시스템 항목(is_system=true)은 삭제하거나 키를 변경할 수 없습니다."),
    FEATURE_DISABLED(HttpStatus.FORBIDDEN, "COMMON_004", "현재 라이선스/설정에서 비활성화된 기능입니다."),
    TOO_MANY_REQUESTS(HttpStatus.TOO_MANY_REQUESTS, "COMMON_005", "단시간 내 요청 횟수가 초과되었습니다. 잠시 후 다시 시도해 주세요."),
    INTERNAL_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "COMMON_999", "서버 내부 오류가 발생했습니다."),

    // Auth & RBAC
    UNAUTHORIZED(HttpStatus.UNAUTHORIZED, "AUTH_001", "인증이 필요합니다."),
    INVALID_TOKEN(HttpStatus.UNAUTHORIZED, "AUTH_002", "유효하지 않거나 만료된 토큰입니다."),
    TOKEN_REUSE_DETECTED(HttpStatus.UNAUTHORIZED, "AUTH_003", "비정상적인 토큰 재사용이 감지되어 모든 세션이 무효화되었습니다."),
    ACCESS_DENIED(HttpStatus.FORBIDDEN, "AUTH_004", "접근 권한이 없습니다."),
    ACCOUNT_LOCKED(HttpStatus.FORBIDDEN, "AUTH_005", "로그인 실패 횟수 초과로 계정이 잠겼습니다."),
    INVALID_TOTP_CODE(HttpStatus.UNAUTHORIZED, "AUTH_006", "Google OTP 2단계 인증 코드가 일치하지 않습니다."),

    // Reservation
    RESERVATION_SLOT_CLOSED(HttpStatus.CONFLICT, "RESV_001", "마감되었거나 예약이 불가능한 시간대입니다."),
    RESERVATION_CAPACITY_EXCEEDED(HttpStatus.CONFLICT, "RESV_002", "선택하신 시간대의 잔여 좌석이 마감되었습니다."),

    // Media & Upload
    UNSUPPORTED_MEDIA_TYPE(HttpStatus.BAD_REQUEST, "MEDIA_001", "허용되지 않는 파일 형식(SVG/스크립트 등)입니다."),
    IMAGE_DIMENSION_EXCEEDED(HttpStatus.BAD_REQUEST, "MEDIA_002", "이미지 최대 허용 해상도(4096x4096)를 초과했습니다."),
    IMAGE_QUEUE_FULL(HttpStatus.SERVICE_UNAVAILABLE, "MEDIA_003", "현재 이미지 변환 대기열이 가득 찼습니다. 잠시 후 다시 시도해 주세요."),

    // Payment (Pro)
    DUPLICATE_PAYMENT_REQUEST(HttpStatus.CONFLICT, "ORDER_001", "이미 처리 중이거나 완료된 결제 요청(멱등성 키 중복)입니다."),
    INVALID_ORDER_STATE(HttpStatus.CONFLICT, "ORDER_002", "현재 주문 상태에서 수행할 수 없는 작업입니다.");

    private final HttpStatus status;
    private final String code;
    private final String message;
}

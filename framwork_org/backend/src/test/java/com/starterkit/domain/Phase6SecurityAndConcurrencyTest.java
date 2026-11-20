package com.starterkit.domain;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.starterkit.api.filter.InquirySpamRateLimitFilter;
import com.starterkit.common.exception.BusinessException;
import com.starterkit.common.exception.ErrorCode;
import com.starterkit.common.security.TotpVerifier;
import com.starterkit.domain.reservation.ReservationSlot;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockFilterChain;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;

import java.time.LocalDate;
import java.time.LocalTime;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class Phase6SecurityAndConcurrencyTest {

    @Test
    @DisplayName("[보안 필터] 동일 IP에서 1분 내 3회 초과 상담 문의 시 4번째 요청부터 429 Too Many Requests로 차단한다")
    void inquirySpamRateLimitFilter_blocksAfterThreeRequests() throws Exception {
        InquirySpamRateLimitFilter filter = new InquirySpamRateLimitFilter(new ObjectMapper().findAndRegisterModules(), 3);
        MockFilterChain chain = new MockFilterChain();

        for (int i = 1; i <= 3; i++) {
            MockHttpServletRequest req = new MockHttpServletRequest("POST", "/api/v1/inquiries");
            req.setRemoteAddr("198.51.100.77");
            MockHttpServletResponse res = new MockHttpServletResponse();
            filter.doFilter(req, res, new MockFilterChain());
            assertThat(res.getStatus()).isEqualTo(200);
        }

        // 4번째 요청은 429 차단
        MockHttpServletRequest blockedReq = new MockHttpServletRequest("POST", "/api/v1/inquiries");
        blockedReq.setRemoteAddr("198.51.100.77");
        MockHttpServletResponse blockedRes = new MockHttpServletResponse();
        filter.doFilter(blockedReq, blockedRes, chain);

        assertThat(blockedRes.getStatus()).isEqualTo(429);
        assertThat(blockedRes.getContentAsString()).contains("COMMON_005");
    }

    @Test
    @DisplayName("[예약 슬롯 무결성] 예약 및 취소 반복 시 reservedCount는 0 이상 maxCapacity 이하를 유지한다")
    void reservationSlot_reserveAndRelease_preservesInvariants() {
        ReservationSlot slot = ReservationSlot.builder()
                .slotDate(LocalDate.of(2026, 12, 1))
                .slotTime(LocalTime.of(10, 0))
                .serviceName("클리닉 진료")
                .maxCapacity(3)
                .closed(false)
                .build();

        slot.reserve(2, false);
        assertThat(slot.getReservedCount()).isEqualTo(2);
        assertThat(slot.isAvailable(false)).isTrue();

        slot.reserve(1, false);
        assertThat(slot.getReservedCount()).isEqualTo(3);
        assertThat(slot.isAvailable(false)).isFalse();

        // 초과 예약 시도 차단
        assertThatThrownBy(() -> slot.reserve(1, false))
                .isInstanceOf(BusinessException.class)
                .extracting(ex -> ((BusinessException) ex).getErrorCode())
                .isEqualTo(ErrorCode.RESERVATION_CAPACITY_EXCEEDED);

        // 2명 취소 후 다시 2명 예약 가능
        slot.release(2);
        assertThat(slot.getReservedCount()).isEqualTo(1);
        assertThat(slot.isAvailable(false)).isTrue();
    }

    @Test
    @DisplayName("[TOTP 보안] 잘못된 형식의 OTP 코드는 즉시 false를 반환한다")
    void totpVerifier_rejectsMalformedCode() {
        assertThat(TotpVerifier.verify("JBSWY3DPEHPK3PXP", "abc")).isFalse();
        assertThat(TotpVerifier.verify("JBSWY3DPEHPK3PXP", "")).isFalse();
        assertThat(TotpVerifier.verify("", "123456")).isFalse();
    }
}

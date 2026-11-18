package com.starterkit.domain;

import com.starterkit.common.config.FeatureSwitch;
import com.starterkit.common.exception.BusinessException;
import com.starterkit.common.exception.ErrorCode;
import com.starterkit.domain.inquiry.InquiryService;
import com.starterkit.domain.order.Order;
import com.starterkit.domain.order.OrderRepository;
import com.starterkit.domain.order.OrderService;
import com.starterkit.domain.order.PaymentPort;
import com.starterkit.domain.reservation.ReservationService;
import com.starterkit.infra.excel.ExcelExportService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;

@ExtendWith(MockitoExtension.class)
class Phase4ProFeaturesTest {

    @Mock
    private OrderRepository orderRepository;
    @Mock
    private PaymentPort paymentPort;
    @Mock
    private FeatureSwitch featureSwitch;
    @Mock
    private InquiryService inquiryService;
    @Mock
    private ReservationService reservationService;

    private OrderService orderService;
    private ExcelExportService excelExportService;

    @BeforeEach
    void setUp() {
        orderService = new OrderService(orderRepository, paymentPort, featureSwitch);
        excelExportService = new ExcelExportService(inquiryService, reservationService, featureSwitch);
    }

    @Test
    @DisplayName("[Pro 결제] Standard 모드(paymentEnabled=false)에서는 주문 생성 시 FEATURE_DISABLED 예외를 반환한다")
    void createOrder_whenPaymentDisabled_throwsForbidden() {
        given(featureSwitch.isPaymentEnabled()).willReturn(false);

        assertThatThrownBy(() -> orderService.createOrder(new OrderService.CreateOrderCommand(
                1L, "상담 예약금", new BigDecimal("50000.00"), "idem-1", "MOCK"
        )))
                .isInstanceOf(BusinessException.class)
                .extracting(ex -> ((BusinessException) ex).getErrorCode())
                .isEqualTo(ErrorCode.FEATURE_DISABLED);
    }

    @Test
    @DisplayName("[Pro 결제] 동일한 idempotency_key로 중복 주문 요청 시 DUPLICATE_PAYMENT_REQUEST를 반환한다")
    void createOrder_duplicateIdempotencyKey_throwsConflict() {
        given(featureSwitch.isPaymentEnabled()).willReturn(true);
        Order existing = Order.builder()
                .orderName("기존 주문")
                .totalAmount(new BigDecimal("10000.00"))
                .idempotencyKey("idem-dup-key")
                .build();
        given(orderRepository.findByIdempotencyKey("idem-dup-key")).willReturn(Optional.of(existing));

        assertThatThrownBy(() -> orderService.createOrder(new OrderService.CreateOrderCommand(
                1L, "중복 주문", new BigDecimal("10000.00"), "idem-dup-key", "MOCK"
        )))
                .isInstanceOf(BusinessException.class)
                .extracting(ex -> ((BusinessException) ex).getErrorCode())
                .isEqualTo(ErrorCode.DUPLICATE_PAYMENT_REQUEST);
    }

    @Test
    @DisplayName("[Pro 결제] PENDING -> PAID -> REFUNDED 상태 전이 및 중복 환불 차단 검증")
    void orderStateMachine_confirmAndRefund_worksCorrectly() {
        given(featureSwitch.isPaymentEnabled()).willReturn(true);
        Order order = Order.builder()
                .memberId(1L)
                .orderName("프로 플랜 예약금")
                .totalAmount(new BigDecimal("30000.00"))
                .idempotencyKey("idem-state-1")
                .pgProvider("MOCK")
                .build();
        UUID publicId = order.getPublicId();

        given(orderRepository.findByPublicId(publicId)).willReturn(Optional.of(order));
        given(paymentPort.confirmPayment(any(), any(), any(), any()))
                .willReturn(new PaymentPort.PgConfirmResult(true, "MOCK_TX_123", "{\"status\":\"DONE\"}"));
        given(paymentPort.cancelPayment(any(), any(), any()))
                .willReturn(new PaymentPort.PgCancelResult(true, "{\"status\":\"CANCELED\"}"));

        // 1. 결제 승인 (PENDING -> PAID)
        OrderService.OrderResult paidResult = orderService.confirmOrderPayment(publicId, "pay-key-1");
        assertThat(paidResult.status()).isEqualTo("PAID");
        assertThat(paidResult.pgTransactionId()).isEqualTo("MOCK_TX_123");

        // 2. 관리자 환불 (PAID -> REFUNDED)
        OrderService.OrderResult refundedResult = orderService.cancelOrRefundByAdmin(publicId, "고객 요청");
        assertThat(refundedResult.status()).isEqualTo("REFUNDED");

        // 3. 이미 환불된 주문 재환불 시도 -> INVALID_ORDER_STATE
        assertThatThrownBy(() -> orderService.cancelOrRefundByAdmin(publicId, "중복 환불"))
                .isInstanceOf(BusinessException.class)
                .extracting(ex -> ((BusinessException) ex).getErrorCode())
                .isEqualTo(ErrorCode.INVALID_ORDER_STATE);
    }

    @Test
    @DisplayName("[Pro 엑셀] SXSSF 스트리밍 엑셀 생성 시 정상 XLSX 바이너리(PK 헤더)를 반환한다")
    void exportInquiriesToXlsx_returnsValidXlsxBytes() {
        given(featureSwitch.isExcelExportEnabled()).willReturn(true);
        given(inquiryService.listInquiriesForAdmin(null)).willReturn(List.of(
                new InquiryService.InquiryDetailResult(
                        1L, UUID.randomUUID(), "ESTIMATE", "홍길동", "010-1234-5678",
                        "hong@test.com", "홈페이지 제작 문의", "내용", "{}", null,
                        "PENDING", null, "127.0.0.1", null, null, OffsetDateTime.now()
                )
        ));

        byte[] xlsxBytes = excelExportService.exportInquiriesToXlsx();

        assertThat(xlsxBytes).isNotEmpty();
        assertThat(xlsxBytes[0]).isEqualTo((byte) 'P');
        assertThat(xlsxBytes[1]).isEqualTo((byte) 'K');
    }
}

package com.starterkit.infra.payment;

import com.starterkit.domain.order.PaymentPort;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.UUID;

/**
 * 기본 내장 Mock PG 어댑터.
 * 실서비스 연동 시 TossPayments / PortOne REST Client 어댑터로 교체합니다.
 */
@Slf4j
@Component
public class MockPaymentAdapter implements PaymentPort {

    @Override
    public PgConfirmResult confirmPayment(String pgProvider, String paymentKey, String orderPublicId, BigDecimal amount) {
        String txId = "MOCK_TX_" + UUID.randomUUID().toString().substring(0, 12);
        String payload = String.format(
                "{\"provider\":\"%s\",\"paymentKey\":\"%s\",\"orderId\":\"%s\",\"amount\":%s,\"status\":\"DONE\"}",
                pgProvider, paymentKey, orderPublicId, amount.toPlainString()
        );
        log.info("[MockPaymentAdapter] Approved payment orderPublicId={}, txId={}, amount={}", orderPublicId, txId, amount);
        return new PgConfirmResult(true, txId, payload);
    }

    @Override
    public PgCancelResult cancelPayment(String pgProvider, String pgTransactionId, String reason) {
        String payload = String.format(
                "{\"provider\":\"%s\",\"txId\":\"%s\",\"reason\":\"%s\",\"status\":\"CANCELED\"}",
                pgProvider, pgTransactionId, reason != null ? reason : "ADMIN_CANCEL"
        );
        log.info("[MockPaymentAdapter] Cancelled payment txId={}", pgTransactionId);
        return new PgCancelResult(true, payload);
    }
}

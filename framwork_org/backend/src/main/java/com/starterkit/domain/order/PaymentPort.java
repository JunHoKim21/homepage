package com.starterkit.domain.order;

import java.math.BigDecimal;

public interface PaymentPort {

    record PgConfirmResult(boolean approved, String pgTransactionId, String rawPayload) {}
    record PgCancelResult(boolean cancelled, String rawPayload) {}

    PgConfirmResult confirmPayment(String pgProvider, String paymentKey, String orderPublicId, BigDecimal amount);
    PgCancelResult cancelPayment(String pgProvider, String pgTransactionId, String reason);
}

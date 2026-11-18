package com.starterkit.domain.order;

import com.starterkit.common.config.FeatureSwitch;
import com.starterkit.common.exception.BusinessException;
import com.starterkit.common.exception.ErrorCode;
import com.starterkit.domain.audit.AuditLog;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final PaymentPort paymentPort;
    private final FeatureSwitch featureSwitch;

    public record CreateOrderCommand(
            Long memberId,
            String orderName,
            BigDecimal totalAmount,
            String idempotencyKey,
            String pgProvider
    ) {}

    public record OrderResult(
            Long id,
            UUID publicId,
            Long memberId,
            String orderName,
            BigDecimal totalAmount,
            String status,
            String idempotencyKey,
            String pgProvider,
            String pgTransactionId,
            OffsetDateTime createdAt
    ) {}

    @Transactional
    public OrderResult createOrder(CreateOrderCommand cmd) {
        ensurePaymentEnabled();

        if (cmd.totalAmount() == null || cmd.totalAmount().compareTo(BigDecimal.ZERO) <= 0) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "결제 금액은 0보다 커야 합니다.");
        }

        // 멱등성 키 중복 검사
        if (orderRepository.findByIdempotencyKey(cmd.idempotencyKey()).isPresent()) {
            throw new BusinessException(ErrorCode.DUPLICATE_PAYMENT_REQUEST);
        }

        Order order = Order.builder()
                .memberId(cmd.memberId())
                .orderName(cmd.orderName().trim())
                .totalAmount(cmd.totalAmount())
                .idempotencyKey(cmd.idempotencyKey().trim())
                .pgProvider(cmd.pgProvider())
                .build();

        return toResult(orderRepository.save(order));
    }

    @Transactional
    public OrderResult confirmOrderPayment(UUID orderPublicId, String paymentKey) {
        ensurePaymentEnabled();

        Order order = orderRepository.findByPublicId(orderPublicId)
                .orElseThrow(() -> new BusinessException(ErrorCode.RESOURCE_NOT_FOUND));

        if (order.getStatus() == Order.OrderStatus.PAID) {
            throw new BusinessException(ErrorCode.DUPLICATE_PAYMENT_REQUEST);
        }

        PaymentPort.PgConfirmResult pgResult = paymentPort.confirmPayment(
                order.getPgProvider(), paymentKey, order.getPublicId().toString(), order.getTotalAmount()
        );
        if (!pgResult.approved()) {
            throw new BusinessException(ErrorCode.INVALID_ORDER_STATE, "PG사 결제 승인에 실패했습니다.");
        }

        order.markPaid(pgResult.pgTransactionId(), pgResult.rawPayload());
        return toResult(order);
    }

    @AuditLog(actionType = "REFUND", domainType = "ORDER")
    @Transactional
    public OrderResult cancelOrRefundByAdmin(UUID orderPublicId, String reason) {
        ensurePaymentEnabled();

        Order order = orderRepository.findByPublicId(orderPublicId)
                .orElseThrow(() -> new BusinessException(ErrorCode.RESOURCE_NOT_FOUND));

        if (order.getStatus() == Order.OrderStatus.PAID) {
            PaymentPort.PgCancelResult cancelResult = paymentPort.cancelPayment(
                    order.getPgProvider(), order.getPgTransactionId(), reason
            );
            if (!cancelResult.cancelled()) {
                throw new BusinessException(ErrorCode.INVALID_ORDER_STATE, "PG사 환불 처리에 실패했습니다.");
            }
            order.cancelOrRefund(Order.OrderStatus.REFUNDED, cancelResult.rawPayload());
        } else {
            order.cancelOrRefund(Order.OrderStatus.CANCELLED, null);
        }

        return toResult(order);
    }

    @Transactional(readOnly = true)
    public List<OrderResult> listAllOrdersForAdmin() {
        ensurePaymentEnabled();
        return orderRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(this::toResult)
                .toList();
    }

    private void ensurePaymentEnabled() {
        if (!featureSwitch.isPaymentEnabled()) {
            throw new BusinessException(ErrorCode.FEATURE_DISABLED, "결제 기능이 비활성화되어 있습니다 (starter.features.payment-enabled=false).");
        }
    }

    private OrderResult toResult(Order o) {
        return new OrderResult(
                o.getId(),
                o.getPublicId(),
                o.getMemberId(),
                o.getOrderName(),
                o.getTotalAmount(),
                o.getStatus().name(),
                o.getIdempotencyKey(),
                o.getPgProvider(),
                o.getPgTransactionId(),
                o.getCreatedAt()
        );
    }
}

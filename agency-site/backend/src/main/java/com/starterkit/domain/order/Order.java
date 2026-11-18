package com.starterkit.domain.order;

import com.starterkit.common.exception.BusinessException;
import com.starterkit.common.exception.ErrorCode;
import com.starterkit.common.util.UuidV7Generator;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "orders")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "public_id", nullable = false, unique = true)
    private UUID publicId;

    @Column(name = "member_id")
    private Long memberId;

    @Column(name = "order_name", nullable = false)
    private String orderName;

    @Column(name = "total_amount", nullable = false, precision = 15, scale = 2)
    private BigDecimal totalAmount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private OrderStatus status;

    @Column(name = "idempotency_key", nullable = false, unique = true, length = 100)
    private String idempotencyKey;

    @Column(name = "pg_provider", length = 50)
    private String pgProvider; // MOCK, TOSS, PORTONE

    @Column(name = "pg_transaction_id")
    private String pgTransactionId;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "raw_webhook_payload", columnDefinition = "jsonb")
    private String rawWebhookPayload;

    @Column(name = "created_at", nullable = false, updatable = false)
    private OffsetDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private OffsetDateTime updatedAt;

    @Builder
    public Order(Long memberId, String orderName, BigDecimal totalAmount, String idempotencyKey, String pgProvider) {
        this.publicId = UuidV7Generator.generate();
        this.memberId = memberId;
        this.orderName = orderName;
        this.totalAmount = totalAmount;
        this.status = OrderStatus.PENDING;
        this.idempotencyKey = idempotencyKey;
        this.pgProvider = pgProvider != null && !pgProvider.isBlank() ? pgProvider : "MOCK";
    }

    @PrePersist
    protected void onCreate() {
        OffsetDateTime now = OffsetDateTime.now();
        if (this.publicId == null) {
            this.publicId = UuidV7Generator.generate();
        }
        this.createdAt = now;
        this.updatedAt = now;
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = OffsetDateTime.now();
    }

    public void markPaid(String pgTransactionId, String rawWebhookPayload) {
        if (this.status != OrderStatus.PENDING) {
            throw new BusinessException(ErrorCode.INVALID_ORDER_STATE, "결제 대기(PENDING) 상태의 주문만 결제 완료 처리할 수 있습니다.");
        }
        this.status = OrderStatus.PAID;
        this.pgTransactionId = pgTransactionId;
        this.rawWebhookPayload = rawWebhookPayload;
    }

    public void cancelOrRefund(OrderStatus nextStatus, String rawWebhookPayload) {
        if (nextStatus != OrderStatus.CANCELLED && nextStatus != OrderStatus.REFUNDED) {
            throw new BusinessException(ErrorCode.INVALID_ORDER_STATE);
        }
        if (this.status == OrderStatus.CANCELLED || this.status == OrderStatus.REFUNDED) {
            throw new BusinessException(ErrorCode.INVALID_ORDER_STATE, "이미 취소 또는 환불 완료된 주문입니다.");
        }
        if (nextStatus == OrderStatus.REFUNDED && this.status != OrderStatus.PAID) {
            throw new BusinessException(ErrorCode.INVALID_ORDER_STATE, "결제 완료(PAID) 상태의 주문만 환불할 수 있습니다.");
        }
        this.status = nextStatus;
        if (rawWebhookPayload != null) {
            this.rawWebhookPayload = rawWebhookPayload;
        }
    }

    public enum OrderStatus {
        PENDING, PAID, CANCELLED, REFUNDED
    }
}

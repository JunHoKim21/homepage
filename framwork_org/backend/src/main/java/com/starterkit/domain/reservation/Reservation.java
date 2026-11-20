package com.starterkit.domain.reservation;

import com.starterkit.common.util.UuidV7Generator;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "reservations")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Reservation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "public_id", nullable = false, unique = true)
    private UUID publicId;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "slot_id", nullable = false)
    private ReservationSlot slot;

    @Column(name = "member_id")
    private Long memberId;

    @Column(name = "customer_name", nullable = false, length = 100)
    private String customerName;

    @Column(name = "customer_phone", nullable = false, length = 50)
    private String customerPhone;

    @Column(name = "customer_email")
    private String customerEmail;

    @Column(name = "visitor_count", nullable = false)
    private int visitorCount;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "custom_fields", nullable = false, columnDefinition = "jsonb")
    private String customFields;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private ReservationStatus status;

    @Column(name = "order_id")
    private Long orderId;

    @Column(name = "admin_memo", columnDefinition = "TEXT")
    private String adminMemo;

    @Column(name = "client_ip", nullable = false, length = 45)
    private String clientIp;

    @Column(name = "created_at", nullable = false, updatable = false)
    private OffsetDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private OffsetDateTime updatedAt;

    @Builder
    public Reservation(ReservationSlot slot, Long memberId, String customerName, String customerPhone,
                       String customerEmail, int visitorCount, String customFields, Long orderId,
                       String clientIp, ReservationStatus initialStatus) {
        this.publicId = UuidV7Generator.generate();
        this.slot = slot;
        this.memberId = memberId;
        this.customerName = customerName;
        this.customerPhone = customerPhone;
        this.customerEmail = customerEmail;
        this.visitorCount = Math.max(1, visitorCount);
        this.customFields = customFields != null && !customFields.isBlank() ? customFields : "{}";
        this.status = initialStatus != null ? initialStatus : ReservationStatus.REQUESTED;
        this.orderId = orderId;
        this.clientIp = clientIp != null ? clientIp : "0.0.0.0";
    }

    @PrePersist
    protected void onCreate() {
        OffsetDateTime now = OffsetDateTime.now();
        if (this.publicId == null) {
            this.publicId = UuidV7Generator.generate();
        }
        if (this.customFields == null || this.customFields.isBlank()) {
            this.customFields = "{}";
        }
        this.createdAt = now;
        this.updatedAt = now;
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = OffsetDateTime.now();
    }

    public boolean changeStatus(ReservationStatus nextStatus, String adminMemo) {
        boolean shouldReleaseSlot = (this.status != ReservationStatus.CANCELLED && nextStatus == ReservationStatus.CANCELLED);
        this.status = nextStatus;
        if (adminMemo != null) {
            this.adminMemo = adminMemo;
        }
        return shouldReleaseSlot;
    }

    public enum ReservationStatus {
        REQUESTED, CONFIRMED, CANCELLED, COMPLETED, NO_SHOW
    }
}

package com.starterkit.domain.inquiry;

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

import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "inquiries")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Inquiry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "public_id", nullable = false, unique = true)
    private UUID publicId;

    @Column(nullable = false, length = 50)
    private String category; // GENERAL, ESTIMATE, PARTNERSHIP

    @Column(name = "customer_name", nullable = false, length = 100)
    private String customerName;

    @Column(name = "customer_phone", nullable = false, length = 50)
    private String customerPhone;

    @Column(name = "customer_email")
    private String customerEmail;

    @Column(nullable = false, length = 300)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "custom_fields", nullable = false, columnDefinition = "jsonb")
    private String customFields;

    @Column(name = "attachment_media_id")
    private Long attachmentMediaId;

    @Column(name = "privacy_agreed", nullable = false)
    private boolean privacyAgreed;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private InquiryStatus status;

    @Column(name = "admin_memo", columnDefinition = "TEXT")
    private String adminMemo;

    @Column(name = "client_ip", nullable = false, length = 45)
    private String clientIp;

    @Column(name = "answered_by", length = 100)
    private String answeredBy;

    @Column(name = "answered_at")
    private OffsetDateTime answeredAt;

    @Column(name = "created_at", nullable = false, updatable = false)
    private OffsetDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private OffsetDateTime updatedAt;

    @Column(name = "deleted_at")
    private OffsetDateTime deletedAt;

    @Builder
    public Inquiry(String category, String customerName, String customerPhone, String customerEmail,
                   String title, String content, String customFields, Long attachmentMediaId,
                   boolean privacyAgreed, String clientIp) {
        this.publicId = UuidV7Generator.generate();
        this.category = category != null && !category.isBlank() ? category : "GENERAL";
        this.customerName = customerName;
        this.customerPhone = customerPhone;
        this.customerEmail = customerEmail;
        this.title = title;
        this.content = content;
        this.customFields = customFields != null && !customFields.isBlank() ? customFields : "{}";
        this.attachmentMediaId = attachmentMediaId;
        this.privacyAgreed = privacyAgreed;
        this.status = InquiryStatus.PENDING;
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

    public void updateStatusAndMemo(InquiryStatus newStatus, String adminMemo, String actor) {
        this.status = newStatus;
        this.adminMemo = adminMemo;
        if (newStatus == InquiryStatus.COMPLETED) {
            this.answeredBy = actor;
            this.answeredAt = OffsetDateTime.now();
        }
    }

    public enum InquiryStatus {
        PENDING, IN_PROGRESS, COMPLETED, SPAM
    }
}

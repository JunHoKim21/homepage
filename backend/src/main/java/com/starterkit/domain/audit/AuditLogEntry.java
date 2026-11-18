package com.starterkit.domain.audit;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.OffsetDateTime;

@Entity
@Table(name = "audit_logs")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class AuditLogEntry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "action_type", nullable = false, length = 50)
    private String actionType;

    @Column(name = "domain_type", nullable = false, length = 50)
    private String domainType;

    @Column(name = "target_id", length = 100)
    private String targetId;

    @Column(name = "actor_id", nullable = false, length = 100)
    private String actorId;

    @Column(name = "client_ip", nullable = false, length = 45)
    private String clientIp;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "before_state", columnDefinition = "jsonb")
    private String beforeState;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "after_state", columnDefinition = "jsonb")
    private String afterState;

    @Column(name = "created_at", nullable = false, updatable = false)
    private OffsetDateTime createdAt;

    @Builder
    public AuditLogEntry(String actionType, String domainType, String targetId, String actorId,
                         String clientIp, String beforeState, String afterState) {
        this.actionType = actionType;
        this.domainType = domainType;
        this.targetId = targetId;
        this.actorId = actorId != null ? actorId : "SYSTEM";
        this.clientIp = clientIp != null ? clientIp : "0.0.0.0";
        this.beforeState = beforeState;
        this.afterState = afterState;
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = OffsetDateTime.now();
    }
}

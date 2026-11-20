package com.starterkit.domain.member;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "refresh_tokens")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class RefreshToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "family_id", nullable = false)
    private UUID familyId;

    @Column(name = "token_hash", nullable = false, unique = true, length = 128)
    private String tokenHash;

    @Enumerated(EnumType.STRING)
    @Column(name = "subject_type", nullable = false, length = 20)
    private SubjectType subjectType;

    @Column(name = "subject_id", nullable = false)
    private Long subjectId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private TokenStatus status;

    @Column(name = "replaced_by_token_hash", length = 128)
    private String replacedByTokenHash;

    @Column(name = "used_at")
    private OffsetDateTime usedAt;

    @Column(name = "expires_at", nullable = false)
    private OffsetDateTime expiresAt;

    @Column(name = "created_at", nullable = false, updatable = false)
    private OffsetDateTime createdAt;

    @Builder
    public RefreshToken(UUID familyId, String tokenHash, SubjectType subjectType, Long subjectId, OffsetDateTime expiresAt) {
        this.familyId = familyId;
        this.tokenHash = tokenHash;
        this.subjectType = subjectType;
        this.subjectId = subjectId;
        this.status = TokenStatus.ACTIVE;
        this.expiresAt = expiresAt;
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = OffsetDateTime.now();
    }

    public boolean isExpired(OffsetDateTime now) {
        return expiresAt.isBefore(now);
    }

    public boolean isWithinGraceWindow(OffsetDateTime now, long graceWindowSeconds) {
        if (this.status != TokenStatus.USED || this.usedAt == null) {
            return false;
        }
        return !now.isAfter(this.usedAt.plusSeconds(graceWindowSeconds));
    }

    public void markUsed(String newTokenHash, OffsetDateTime now) {
        this.status = TokenStatus.USED;
        this.replacedByTokenHash = newTokenHash;
        this.usedAt = now;
    }

    public void revoke() {
        this.status = TokenStatus.REVOKED;
    }

    public enum SubjectType {
        MEMBER, ADMIN
    }

    public enum TokenStatus {
        ACTIVE, USED, REVOKED
    }
}

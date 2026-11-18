package com.starterkit.domain.member;

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

import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "members")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Member {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "public_id", nullable = false, unique = true)
    private UUID publicId;

    @Column(nullable = false)
    private String email;

    @Column(name = "password_hash")
    private String passwordHash;

    @Column(nullable = false, length = 100)
    private String nickname;

    @Column(name = "phone_number", length = 50)
    private String phoneNumber;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private MemberStatus status;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private MemberRole role;

    @Column(name = "email_verified_at")
    private OffsetDateTime emailVerifiedAt;

    @Column(name = "last_login_at")
    private OffsetDateTime lastLoginAt;

    @Column(name = "created_at", nullable = false, updatable = false)
    private OffsetDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private OffsetDateTime updatedAt;

    @Column(name = "deleted_at")
    private OffsetDateTime deletedAt;

    @Builder
    public Member(String email, String passwordHash, String nickname, String phoneNumber, MemberRole role) {
        this.publicId = UuidV7Generator.generate();
        this.email = email;
        this.passwordHash = passwordHash;
        this.nickname = nickname;
        this.phoneNumber = phoneNumber;
        this.status = MemberStatus.ACTIVE;
        this.role = role != null ? role : MemberRole.USER;
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

    public void recordLogin() {
        this.lastLoginAt = OffsetDateTime.now();
    }

    public void withdraw() {
        this.status = MemberStatus.WITHDRAWN;
        this.deletedAt = OffsetDateTime.now();
    }

    public enum MemberStatus {
        ACTIVE, SUSPENDED, WITHDRAWN
    }

    public enum MemberRole {
        USER, VIP
    }
}

package com.starterkit.domain.cms;

import com.starterkit.common.exception.BusinessException;
import com.starterkit.common.exception.ErrorCode;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.OffsetDateTime;

@Entity
@Table(name = "site_configs")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class SiteConfig {

    @Id
    @Column(name = "config_key", nullable = false, length = 100)
    private String configKey;

    @Column(name = "config_value", nullable = false, columnDefinition = "TEXT")
    private String configValue;

    @Column(name = "value_type", nullable = false, length = 20)
    private String valueType; // STRING, NUMBER, BOOLEAN, JSON, COLOR, IMAGE

    @Column(name = "group_name", nullable = false, length = 50)
    private String groupName; // SEO, BRANDING, RESERVATION, NOTIFICATION, COMPANY

    @Column(nullable = false)
    private String description;

    @Column(name = "is_public", nullable = false)
    private boolean publicVisible;

    @Column(name = "is_system", nullable = false)
    private boolean system;

    @Column(name = "updated_by", length = 100)
    private String updatedBy;

    @Column(name = "updated_at", nullable = false)
    private OffsetDateTime updatedAt;

    @Builder
    public SiteConfig(String configKey, String configValue, String valueType, String groupName,
                      String description, boolean publicVisible, boolean system, String updatedBy) {
        this.configKey = configKey;
        this.configValue = configValue;
        this.valueType = valueType != null ? valueType : "STRING";
        this.groupName = groupName;
        this.description = description;
        this.publicVisible = publicVisible;
        this.system = system;
        this.updatedBy = updatedBy;
    }

    @PrePersist
    @PreUpdate
    protected void onSave() {
        this.updatedAt = OffsetDateTime.now();
    }

    public void updateValue(String newValue, String actor) {
        this.configValue = newValue != null ? newValue : "";
        this.updatedBy = actor;
        this.updatedAt = OffsetDateTime.now();
    }

    public void validateDeletable() {
        if (this.system) {
            throw new BusinessException(
                    ErrorCode.SYSTEM_LOCKED_RESOURCE,
                    "필수 시스템 설정 키(" + this.configKey + ")는 삭제할 수 없으며 값(Value)만 변경할 수 있습니다."
            );
        }
    }
}

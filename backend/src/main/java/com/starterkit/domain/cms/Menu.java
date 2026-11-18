package com.starterkit.domain.cms;

import com.starterkit.common.exception.BusinessException;
import com.starterkit.common.exception.ErrorCode;
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

@Entity
@Table(name = "menus")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Menu {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "parent_id")
    private Long parentId;

    @Enumerated(EnumType.STRING)
    @Column(name = "menu_type", nullable = false, length = 20)
    private MenuType menuType;

    @Column(name = "menu_name", nullable = false, length = 100)
    private String menuName;

    @Column(name = "route_path", nullable = false)
    private String routePath;

    @Column(name = "icon_name", length = 50)
    private String iconName;

    @Column(name = "sort_order", nullable = false)
    private int sortOrder;

    @Column(name = "is_visible", nullable = false)
    private boolean visible;

    @Column(name = "is_system", nullable = false)
    private boolean system;

    @Column(name = "required_permission", length = 100)
    private String requiredPermission;

    @Column(name = "created_at", nullable = false, updatable = false)
    private OffsetDateTime createdAt;

    @Builder
    public Menu(Long parentId, MenuType menuType, String menuName, String routePath,
                String iconName, int sortOrder, boolean visible, boolean system, String requiredPermission) {
        this.parentId = parentId;
        this.menuType = menuType != null ? menuType : MenuType.PUBLIC;
        this.menuName = menuName;
        this.routePath = routePath;
        this.iconName = iconName;
        this.sortOrder = sortOrder;
        this.visible = visible;
        this.system = system;
        this.requiredPermission = requiredPermission;
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = OffsetDateTime.now();
    }

    public void update(String menuName, String routePath, String iconName, int sortOrder, boolean visible) {
        if (this.system && routePath != null && !this.routePath.equals(routePath)) {
            throw new BusinessException(ErrorCode.SYSTEM_LOCKED_RESOURCE, "필수 시스템 메뉴(is_system=true)의 라우트 경로는 변경할 수 없습니다.");
        }
        this.menuName = menuName;
        if (!this.system && routePath != null) {
            this.routePath = routePath;
        }
        this.iconName = iconName;
        this.sortOrder = sortOrder;
        this.visible = visible;
    }

    public void validateDeletable() {
        if (this.system) {
            throw new BusinessException(ErrorCode.SYSTEM_LOCKED_RESOURCE, "필수 시스템 메뉴(is_system=true)는 삭제할 수 없습니다.");
        }
    }

    public enum MenuType {
        PUBLIC, ADMIN
    }
}

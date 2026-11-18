package com.starterkit.domain.cms;

import com.starterkit.common.exception.BusinessException;
import com.starterkit.common.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class MenuService {

    private final MenuRepository menuRepository;

    public record MenuItemResult(
            Long id,
            Long parentId,
            String menuType,
            String menuName,
            String routePath,
            String iconName,
            int sortOrder,
            boolean visible,
            boolean isSystem,
            String requiredPermission
    ) {}

    @Cacheable(cacheNames = "publicMenus")
    @Transactional(readOnly = true)
    public List<MenuItemResult> getPublicVisibleMenus() {
        return menuRepository.findByMenuTypeAndVisibleTrueOrderBySortOrderAscIdAsc(Menu.MenuType.PUBLIC)
                .stream()
                .map(this::toResult)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<MenuItemResult> getAdminAccessibleMenus(Set<String> authorities) {
        boolean isSuperAdmin = authorities.contains("ROLE_SUPER_ADMIN");
        return menuRepository.findByMenuTypeAndVisibleTrueOrderBySortOrderAscIdAsc(Menu.MenuType.ADMIN)
                .stream()
                .filter(menu -> isSuperAdmin
                        || menu.getRequiredPermission() == null
                        || menu.getRequiredPermission().isBlank()
                        || authorities.contains(menu.getRequiredPermission()))
                .map(this::toResult)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<MenuItemResult> getAllMenusByType(Menu.MenuType menuType) {
        return menuRepository.findByMenuTypeOrderBySortOrderAscIdAsc(menuType)
                .stream()
                .map(this::toResult)
                .toList();
    }

    @CacheEvict(cacheNames = "publicMenus", allEntries = true)
    @Transactional
    public MenuItemResult createMenu(Long parentId, Menu.MenuType menuType, String menuName,
                                     String routePath, String iconName, int sortOrder,
                                     boolean visible, String requiredPermission) {
        Menu menu = Menu.builder()
                .parentId(parentId)
                .menuType(menuType)
                .menuName(menuName)
                .routePath(routePath)
                .iconName(iconName)
                .sortOrder(sortOrder)
                .visible(visible)
                .system(false)
                .requiredPermission(requiredPermission)
                .build();
        return toResult(menuRepository.save(menu));
    }

    @CacheEvict(cacheNames = "publicMenus", allEntries = true)
    @Transactional
    public MenuItemResult updateMenu(Long menuId, String menuName, String routePath,
                                     String iconName, int sortOrder, boolean visible) {
        Menu menu = menuRepository.findById(menuId)
                .orElseThrow(() -> new BusinessException(ErrorCode.RESOURCE_NOT_FOUND));
        menu.update(menuName, routePath, iconName, sortOrder, visible);
        return toResult(menu);
    }

    @CacheEvict(cacheNames = "publicMenus", allEntries = true)
    @Transactional
    public void deleteMenu(Long menuId) {
        Menu menu = menuRepository.findById(menuId)
                .orElseThrow(() -> new BusinessException(ErrorCode.RESOURCE_NOT_FOUND));
        menu.validateDeletable();
        menuRepository.delete(menu);
    }

    private MenuItemResult toResult(Menu menu) {
        return new MenuItemResult(
                menu.getId(),
                menu.getParentId(),
                menu.getMenuType().name(),
                menu.getMenuName(),
                menu.getRoutePath(),
                menu.getIconName(),
                menu.getSortOrder(),
                menu.isVisible(),
                menu.isSystem(),
                menu.getRequiredPermission()
        );
    }
}

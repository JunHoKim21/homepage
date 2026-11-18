package com.starterkit.api.adminapi;

import com.starterkit.common.response.ApiResponse;
import com.starterkit.common.security.AuthenticatedPrincipal;
import com.starterkit.domain.cms.Menu;
import com.starterkit.domain.cms.MenuService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/menus")
@RequiredArgsConstructor
public class AdminMenuController {

    private final MenuService menuService;

    public record CreateMenuPayload(
            Long parentId,
            Menu.MenuType menuType,
            @NotBlank String menuName,
            @NotBlank String routePath,
            String iconName,
            int sortOrder,
            boolean visible,
            String requiredPermission
    ) {}

    public record UpdateMenuPayload(
            @NotBlank String menuName,
            String routePath,
            String iconName,
            int sortOrder,
            boolean visible
    ) {}

    @GetMapping("/sidebar")
    public ApiResponse<List<MenuService.MenuItemResult>> getSidebarMenus(
            @AuthenticationPrincipal AuthenticatedPrincipal principal) {
        return ApiResponse.ok(menuService.getAdminAccessibleMenus(principal.authorities()));
    }

    @GetMapping
    public ApiResponse<List<MenuService.MenuItemResult>> listMenusByType(
            @RequestParam(defaultValue = "PUBLIC") Menu.MenuType menuType) {
        return ApiResponse.ok(menuService.getAllMenusByType(menuType));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<MenuService.MenuItemResult> createMenu(@Valid @RequestBody CreateMenuPayload p) {
        return ApiResponse.ok(menuService.createMenu(
                p.parentId(), p.menuType(), p.menuName(), p.routePath(),
                p.iconName(), p.sortOrder(), p.visible(), p.requiredPermission()
        ));
    }

    @PutMapping("/{menuId}")
    public ApiResponse<MenuService.MenuItemResult> updateMenu(
            @PathVariable Long menuId,
            @Valid @RequestBody UpdateMenuPayload p) {
        return ApiResponse.ok(menuService.updateMenu(
                menuId, p.menuName(), p.routePath(), p.iconName(), p.sortOrder(), p.visible()
        ));
    }

    @DeleteMapping("/{menuId}")
    public ApiResponse<Void> deleteMenu(@PathVariable Long menuId) {
        menuService.deleteMenu(menuId);
        return ApiResponse.ok();
    }
}

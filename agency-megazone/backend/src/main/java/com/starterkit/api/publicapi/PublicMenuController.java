package com.starterkit.api.publicapi;

import com.starterkit.common.response.ApiResponse;
import com.starterkit.domain.cms.MenuService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/menus")
@RequiredArgsConstructor
public class PublicMenuController {

    private final MenuService menuService;

    @GetMapping
    public ApiResponse<List<MenuService.MenuItemResult>> listVisiblePublicMenus() {
        return ApiResponse.ok(menuService.getPublicVisibleMenus());
    }
}

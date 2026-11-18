package com.starterkit.domain.cms;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MenuRepository extends JpaRepository<Menu, Long> {
    List<Menu> findByMenuTypeAndVisibleTrueOrderBySortOrderAscIdAsc(Menu.MenuType menuType);
    List<Menu> findByMenuTypeOrderBySortOrderAscIdAsc(Menu.MenuType menuType);
}

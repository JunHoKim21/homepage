package com.starterkit.domain.cms;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SiteConfigRepository extends JpaRepository<SiteConfig, String> {
    List<SiteConfig> findByPublicVisibleTrueOrderByGroupNameAscConfigKeyAsc();
    List<SiteConfig> findAllByOrderByGroupNameAscConfigKeyAsc();
}

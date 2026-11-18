package com.starterkit.domain.cms;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CmsContentRepository extends JpaRepository<CmsContent, Long> {
    List<CmsContent> findByCategoryAndPublishedTrueAndDeletedAtIsNullOrderByPinnedDescCreatedAtDesc(CmsContent.CmsCategory category);
    List<CmsContent> findByCategoryAndDeletedAtIsNullOrderByPinnedDescCreatedAtDesc(CmsContent.CmsCategory category);
    Optional<CmsContent> findBySlugAndCategoryAndDeletedAtIsNull(String slug, CmsContent.CmsCategory category);
    Optional<CmsContent> findByIdAndDeletedAtIsNull(Long id);
}

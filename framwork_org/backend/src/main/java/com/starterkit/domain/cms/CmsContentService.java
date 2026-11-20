package com.starterkit.domain.cms;

import com.starterkit.common.exception.BusinessException;
import com.starterkit.common.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CmsContentService {

    private final CmsContentRepository cmsContentRepository;
    private final ApplicationEventPublisher eventPublisher;

    public record CmsContentResult(
            Long id,
            String slug,
            String category,
            String title,
            String summary,
            String contentHtml,
            String thumbnailUrl,
            String extraJson,
            long viewCount,
            boolean isPinned,
            boolean isPublished,
            boolean isSystem,
            String authorId,
            OffsetDateTime createdAt,
            OffsetDateTime updatedAt
    ) {}

    public record SaveCmsContentCommand(
            String slug,
            CmsContent.CmsCategory category,
            String title,
            String summary,
            String contentHtml,
            String thumbnailUrl,
            String extraJson,
            boolean isPinned,
            boolean isPublished
    ) {}

    @Transactional(readOnly = true)
    public List<CmsContentResult> getPublishedByCategory(CmsContent.CmsCategory category) {
        return cmsContentRepository.findByCategoryAndPublishedTrueAndDeletedAtIsNullOrderByPinnedDescCreatedAtDesc(category)
                .stream()
                .map(this::toResult)
                .toList();
    }

    @Transactional
    public CmsContentResult getPublishedDetailBySlug(CmsContent.CmsCategory category, String slug) {
        CmsContent content = cmsContentRepository.findBySlugAndCategoryAndDeletedAtIsNull(slug, category)
                .filter(CmsContent::isPublished)
                .orElseThrow(() -> new BusinessException(ErrorCode.RESOURCE_NOT_FOUND));
        content.incrementViewCount();
        return toResult(content);
    }

    @Transactional(readOnly = true)
    public List<CmsContentResult> getAllByCategoryForAdmin(CmsContent.CmsCategory category) {
        return cmsContentRepository.findByCategoryAndDeletedAtIsNullOrderByPinnedDescCreatedAtDesc(category)
                .stream()
                .map(this::toResult)
                .toList();
    }

    @Transactional
    public CmsContentResult createContent(SaveCmsContentCommand cmd, String authorId) {
        CmsContent content = CmsContent.builder()
                .slug(cmd.slug().trim())
                .category(cmd.category())
                .title(cmd.title().trim())
                .summary(cmd.summary())
                .contentHtml(cmd.contentHtml())
                .thumbnailUrl(cmd.thumbnailUrl())
                .extraJson(cmd.extraJson())
                .pinned(cmd.isPinned())
                .published(cmd.isPublished())
                .system(false)
                .authorId(authorId)
                .build();
        CmsContent saved = cmsContentRepository.save(content);
        publishRevalidationIfBannerOrPopup(cmd.category());
        return toResult(saved);
    }

    @Transactional
    public CmsContentResult updateContent(Long id, SaveCmsContentCommand cmd) {
        CmsContent content = cmsContentRepository.findByIdAndDeletedAtIsNull(id)
                .orElseThrow(() -> new BusinessException(ErrorCode.RESOURCE_NOT_FOUND));
        content.update(
                cmd.title(),
                cmd.summary(),
                cmd.contentHtml(),
                cmd.thumbnailUrl(),
                cmd.extraJson(),
                cmd.isPinned(),
                cmd.isPublished()
        );
        publishRevalidationIfBannerOrPopup(content.getCategory());
        return toResult(content);
    }

    @Transactional
    public void deleteContent(Long id) {
        CmsContent content = cmsContentRepository.findByIdAndDeletedAtIsNull(id)
                .orElseThrow(() -> new BusinessException(ErrorCode.RESOURCE_NOT_FOUND));
        content.softDelete();
        publishRevalidationIfBannerOrPopup(content.getCategory());
    }

    private void publishRevalidationIfBannerOrPopup(CmsContent.CmsCategory category) {
        if (category == CmsContent.CmsCategory.BANNER || category == CmsContent.CmsCategory.POPUP) {
            eventPublisher.publishEvent(new SiteConfigUpdatedEvent("site-configs"));
        }
    }

    private CmsContentResult toResult(CmsContent c) {
        return new CmsContentResult(
                c.getId(),
                c.getSlug(),
                c.getCategory().name(),
                c.getTitle(),
                c.getSummary(),
                c.getContentHtml(),
                c.getThumbnailUrl(),
                c.getExtraJson(),
                c.getViewCount(),
                c.isPinned(),
                c.isPublished(),
                c.isSystem(),
                c.getAuthorId(),
                c.getCreatedAt(),
                c.getUpdatedAt()
        );
    }
}

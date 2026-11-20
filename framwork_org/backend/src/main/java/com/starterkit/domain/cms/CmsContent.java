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
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.OffsetDateTime;

@Entity
@Table(name = "cms_contents")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class CmsContent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String slug;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private CmsCategory category;

    @Column(nullable = false, length = 300)
    private String title;

    @Column(length = 500)
    private String summary;

    @Column(name = "content_html", columnDefinition = "TEXT")
    private String contentHtml;

    @Column(name = "thumbnail_url", length = 500)
    private String thumbnailUrl;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "extra_json", columnDefinition = "jsonb")
    private String extraJson;

    @Column(name = "view_count", nullable = false)
    private long viewCount;

    @Column(name = "is_pinned", nullable = false)
    private boolean pinned;

    @Column(name = "is_published", nullable = false)
    private boolean published;

    @Column(name = "is_system", nullable = false)
    private boolean system;

    @Column(name = "author_id", length = 100)
    private String authorId;

    @Column(name = "created_at", nullable = false, updatable = false)
    private OffsetDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private OffsetDateTime updatedAt;

    @Column(name = "deleted_at")
    private OffsetDateTime deletedAt;

    @Builder
    public CmsContent(String slug, CmsCategory category, String title, String summary,
                      String contentHtml, String thumbnailUrl, String extraJson,
                      boolean pinned, boolean published, boolean system, String authorId) {
        this.slug = slug;
        this.category = category;
        this.title = title;
        this.summary = summary;
        this.contentHtml = contentHtml;
        this.thumbnailUrl = thumbnailUrl;
        this.extraJson = extraJson != null ? extraJson : "{}";
        this.viewCount = 0L;
        this.pinned = pinned;
        this.published = published;
        this.system = system;
        this.authorId = authorId;
    }

    @PrePersist
    protected void onCreate() {
        OffsetDateTime now = OffsetDateTime.now();
        this.createdAt = now;
        this.updatedAt = now;
        if (this.extraJson == null || this.extraJson.isBlank()) {
            this.extraJson = "{}";
        }
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = OffsetDateTime.now();
    }

    public void update(String title, String summary, String contentHtml,
                       String thumbnailUrl, String extraJson, boolean pinned, boolean published) {
        this.title = title;
        this.summary = summary;
        this.contentHtml = contentHtml;
        this.thumbnailUrl = thumbnailUrl;
        if (extraJson != null && !extraJson.isBlank()) {
            this.extraJson = extraJson;
        }
        this.pinned = pinned;
        this.published = published;
    }

    public void incrementViewCount() {
        this.viewCount++;
    }

    public void softDelete() {
        if (this.system) {
            throw new BusinessException(ErrorCode.SYSTEM_LOCKED_RESOURCE, "필수 시스템 문서(약관/개인정보처리방침 등)는 삭제할 수 없습니다.");
        }
        this.deletedAt = OffsetDateTime.now();
    }

    public enum CmsCategory {
        NOTICE, FAQ, PORTFOLIO, BANNER, POPUP, TERMS
    }
}

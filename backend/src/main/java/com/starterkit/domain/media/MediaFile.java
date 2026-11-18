package com.starterkit.domain.media;

import com.starterkit.common.util.UuidV7Generator;
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
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "media_files")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class MediaFile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "public_id", nullable = false, unique = true)
    private UUID publicId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Visibility visibility; // PUBLIC, PRIVATE

    @Column(name = "original_filename", nullable = false)
    private String originalFilename;

    @Column(name = "storage_key", nullable = false, unique = true, length = 500)
    private String storageKey;

    @Column(name = "content_type", nullable = false, length = 100)
    private String contentType;

    @Column(name = "file_size", nullable = false)
    private long fileSize;

    private Integer width;

    private Integer height;

    @Column(name = "blur_hash", length = 100)
    private String blurHash;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "variants_json", columnDefinition = "jsonb")
    private String variantsJson;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private MediaStatus status;

    @Column(name = "uploaded_by", length = 100)
    private String uploadedBy;

    @Column(name = "created_at", nullable = false, updatable = false)
    private OffsetDateTime createdAt;

    @Column(name = "deleted_at")
    private OffsetDateTime deletedAt;

    @Builder
    public MediaFile(Visibility visibility, String originalFilename, String storageKey,
                     String contentType, long fileSize, MediaStatus status, String uploadedBy) {
        this.publicId = UuidV7Generator.generate();
        this.visibility = visibility != null ? visibility : Visibility.PUBLIC;
        this.originalFilename = originalFilename;
        this.storageKey = storageKey;
        this.contentType = contentType;
        this.fileSize = fileSize;
        this.variantsJson = "{}";
        this.status = status != null ? status : MediaStatus.PENDING;
        this.uploadedBy = uploadedBy;
    }

    @PrePersist
    protected void onCreate() {
        if (this.publicId == null) {
            this.publicId = UuidV7Generator.generate();
        }
        if (this.variantsJson == null || this.variantsJson.isBlank()) {
            this.variantsJson = "{}";
        }
        this.createdAt = OffsetDateTime.now();
    }

    public void markReady(int width, int height, String blurHash, String variantsJson, String primaryStorageKey) {
        this.width = width;
        this.height = height;
        this.blurHash = blurHash;
        this.variantsJson = variantsJson;
        if (primaryStorageKey != null && !primaryStorageKey.isBlank()) {
            this.storageKey = primaryStorageKey;
            this.contentType = "image/webp";
        }
        this.status = MediaStatus.READY;
    }

    public void markRejected() {
        this.status = MediaStatus.REJECTED;
    }

    public void markFailed() {
        this.status = MediaStatus.FAILED;
    }

    public enum Visibility {
        PUBLIC, PRIVATE
    }

    public enum MediaStatus {
        PENDING, PROCESSING, READY, REJECTED, FAILED
    }
}

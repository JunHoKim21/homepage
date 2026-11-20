package com.starterkit.domain.media;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface MediaFileRepository extends JpaRepository<MediaFile, Long> {
    Optional<MediaFile> findByPublicIdAndDeletedAtIsNull(UUID publicId);
    Optional<MediaFile> findByIdAndDeletedAtIsNull(Long id);
    Optional<MediaFile> findByStorageKeyAndDeletedAtIsNull(String storageKey);
    List<MediaFile> findByVisibilityAndDeletedAtIsNullOrderByCreatedAtDesc(MediaFile.Visibility visibility);
}

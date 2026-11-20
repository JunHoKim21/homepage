package com.starterkit.domain.media;

import com.starterkit.common.exception.BusinessException;
import com.starterkit.common.exception.ErrorCode;
import com.starterkit.common.util.MediaFileGuard;
import com.starterkit.common.util.UuidV7Generator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.InputStream;
import java.nio.file.Path;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class MediaService {

    private final MediaFileRepository mediaFileRepository;
    private final StoragePort storagePort;
    private final ImageProcessPort imageProcessPort;

    public record MediaUploadResult(
            Long id,
            UUID publicId,
            String visibility,
            String originalFilename,
            String storageKey,
            String publicUrl,
            String status,
            String variantsJson,
            OffsetDateTime createdAt
    ) {}

    public record PrivateMediaStreamResult(
            String originalFilename,
            String contentType,
            long fileSize,
            InputStream inputStream
    ) {}

    /**
     * 공개 미디어(/uploads/public):
     * 1. 첫 64B Magic Bytes 검사 (SVG/스크립트 차단, 이미지 또는 MP4/WEBM 동영상 허용)
     * 2. 동영상(MP4/WEBM)인 경우 인코딩 없이 바로 저장 및 READY 처리 (Caddy 직접 스트리밍)
     * 3. 이미지인 경우 ImageReader 헤더 검사(4096x4096 초과 차단) 후 WebP(360/768/1920) 비동기 변환 제출
     */
    @Transactional
    public MediaUploadResult uploadPublicImage(String originalFilename, String contentType,
                                               byte[] fileBytes, String uploadedBy) {
        MediaFileGuard.validatePublicMediaMagicBytes(fileBytes);

        LocalDate today = LocalDate.now();
        String baseRelativeDir = String.format("%04d/%02d", today.getYear(), today.getMonthValue());
        String fileStem = UuidV7Generator.generate().toString();

        if (MediaFileGuard.isSupportedVideo(fileBytes)) {
            boolean isMp4 = MediaFileGuard.isMp4(fileBytes);
            String ext = isMp4 ? ".mp4" : ".webm";
            String resolvedContentType = isMp4 ? "video/mp4" : "video/webm";
            String relativeKey = baseRelativeDir + "/" + fileStem + ext;

            storagePort.saveBytes(MediaFile.Visibility.PUBLIC, relativeKey, fileBytes);

            MediaFile videoFile = MediaFile.builder()
                    .visibility(MediaFile.Visibility.PUBLIC)
                    .originalFilename(sanitizeFilename(originalFilename))
                    .storageKey("/uploads/public/" + relativeKey)
                    .contentType(resolvedContentType)
                    .fileSize(fileBytes.length)
                    .status(MediaFile.MediaStatus.READY)
                    .uploadedBy(uploadedBy)
                    .build();

            return toResult(mediaFileRepository.save(videoFile));
        }

        imageProcessPort.inspectDimensionsOrThrow(fileBytes);

        String tempRelativeKey = baseRelativeDir + "/raw_" + fileStem + ".tmp";

        Path rawTempPath = storagePort.saveBytes(MediaFile.Visibility.PUBLIC, tempRelativeKey, fileBytes);

        MediaFile mediaFile = MediaFile.builder()
                .visibility(MediaFile.Visibility.PUBLIC)
                .originalFilename(sanitizeFilename(originalFilename))
                .storageKey("/uploads/public/" + baseRelativeDir + "/" + fileStem + "_1920.webp")
                .contentType(contentType != null ? contentType : "image/webp")
                .fileSize(fileBytes.length)
                .status(MediaFile.MediaStatus.PENDING)
                .uploadedBy(uploadedBy)
                .build();

        MediaFile saved = mediaFileRepository.save(mediaFile);
        imageProcessPort.submitPublicImageDietJob(saved.getId(), rawTempPath, baseRelativeDir, fileStem);

        return toResult(saved);
    }

    /**
     * 비공개 첨부파일(/uploads/private):
     * 고객이 상담 문의나 예약 시 첨부한 서류는 외부 URL로 직접 접근할 수 없는 private 볼륨에 저장합니다.
     */
    @Transactional
    public MediaUploadResult uploadPrivateAttachment(String originalFilename, String contentType,
                                                     byte[] fileBytes, String uploadedBy) {
        MediaFileGuard.validateMagicBytes(fileBytes, false);

        LocalDate today = LocalDate.now();
        String baseRelativeDir = String.format("%04d/%02d", today.getYear(), today.getMonthValue());
        String safeName = UuidV7Generator.generate() + "_" + sanitizeFilename(originalFilename);
        String relativeKey = baseRelativeDir + "/" + safeName;

        storagePort.saveBytes(MediaFile.Visibility.PRIVATE, relativeKey, fileBytes);

        MediaFile mediaFile = MediaFile.builder()
                .visibility(MediaFile.Visibility.PRIVATE)
                .originalFilename(sanitizeFilename(originalFilename))
                .storageKey(relativeKey)
                .contentType(contentType != null ? contentType : "application/octet-stream")
                .fileSize(fileBytes.length)
                .status(MediaFile.MediaStatus.READY)
                .uploadedBy(uploadedBy)
                .build();

        return toResult(mediaFileRepository.save(mediaFile));
    }

    @Transactional(readOnly = true)
    public PrivateMediaStreamResult openPrivateAttachmentForAdmin(Long mediaId) {
        MediaFile mediaFile = mediaFileRepository.findByIdAndDeletedAtIsNull(mediaId)
                .orElseThrow(() -> new BusinessException(ErrorCode.RESOURCE_NOT_FOUND));

        if (mediaFile.getVisibility() != MediaFile.Visibility.PRIVATE) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "비공개 첨부파일이 아닙니다.");
        }

        InputStream stream = storagePort.openPrivateStream(mediaFile.getStorageKey());
        return new PrivateMediaStreamResult(
                mediaFile.getOriginalFilename(),
                mediaFile.getContentType(),
                mediaFile.getFileSize(),
                stream
        );
    }

    @Transactional(readOnly = true)
    public List<MediaUploadResult> listPublicMedia() {
        return mediaFileRepository.findByVisibilityAndDeletedAtIsNullOrderByCreatedAtDesc(MediaFile.Visibility.PUBLIC)
                .stream()
                .map(this::toResult)
                .toList();
    }

    @Transactional
    public void deletePublicMediaByStorageKey(String storageKey) {
        if (storageKey == null || !storageKey.startsWith("/uploads/public/")) {
            return;
        }
        String relativeKey = storageKey.substring("/uploads/public/".length());
        if (relativeKey.isBlank() || relativeKey.contains("..")) {
            return;
        }

        storagePort.deleteQuietly(MediaFile.Visibility.PUBLIC, relativeKey);
        if (relativeKey.endsWith(".webp")) {
            String baseStem = relativeKey.replaceAll("(_1920|_768|_360)?\\.webp$", "");
            storagePort.deleteQuietly(MediaFile.Visibility.PUBLIC, baseStem + "_1920.webp");
            storagePort.deleteQuietly(MediaFile.Visibility.PUBLIC, baseStem + "_768.webp");
            storagePort.deleteQuietly(MediaFile.Visibility.PUBLIC, baseStem + "_360.webp");
            storagePort.deleteQuietly(MediaFile.Visibility.PUBLIC, baseStem + ".webp");
        }

        mediaFileRepository.findByStorageKeyAndDeletedAtIsNull(storageKey)
                .ifPresent(mediaFileRepository::delete);
    }

    private String sanitizeFilename(String name) {
        if (name == null || name.isBlank()) {
            return "unnamed";
        }
        return name.replaceAll("[^a-zA-Z0-9가-힣._-]", "_");
    }

    private MediaUploadResult toResult(MediaFile m) {
        String publicUrl = m.getVisibility() == MediaFile.Visibility.PUBLIC ? m.getStorageKey() : null;
        return new MediaUploadResult(
                m.getId(),
                m.getPublicId(),
                m.getVisibility().name(),
                m.getOriginalFilename(),
                m.getStorageKey(),
                publicUrl,
                m.getStatus().name(),
                m.getVariantsJson(),
                m.getCreatedAt()
        );
    }
}

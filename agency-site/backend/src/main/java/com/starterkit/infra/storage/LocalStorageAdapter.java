package com.starterkit.infra.storage;

import com.starterkit.common.exception.BusinessException;
import com.starterkit.common.exception.ErrorCode;
import com.starterkit.domain.media.MediaFile;
import com.starterkit.domain.media.StoragePort;
import com.starterkit.infra.config.StarterProperties;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Slf4j
@Component
@RequiredArgsConstructor
public class LocalStorageAdapter implements StoragePort {

    private final StarterProperties starterProperties;

    @Override
    public Path saveBytes(MediaFile.Visibility visibility, String relativeKey, byte[] content) {
        Path baseRoot = resolveRoot(visibility);
        Path target = baseRoot.resolve(relativeKey).normalize();
        if (!target.startsWith(baseRoot)) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "잘못된 파일 저장 경로입니다.");
        }
        try {
            Files.createDirectories(target.getParent());
            Files.write(target, content);
            return target;
        } catch (IOException e) {
            log.error("[LocalStorageAdapter] 파일 저장 실패: path={}", target, e);
            throw new BusinessException(ErrorCode.INTERNAL_ERROR, "파일 저장 중 오류가 발생했습니다.");
        }
    }

    @Override
    public InputStream openPrivateStream(String relativeKey) {
        Path baseRoot = resolveRoot(MediaFile.Visibility.PRIVATE);
        Path target = baseRoot.resolve(relativeKey).normalize();
        if (!target.startsWith(baseRoot) || !Files.exists(target)) {
            throw new BusinessException(ErrorCode.RESOURCE_NOT_FOUND, "첨부파일을 찾을 수 없습니다.");
        }
        try {
            return Files.newInputStream(target);
        } catch (IOException e) {
            throw new BusinessException(ErrorCode.INTERNAL_ERROR, "첨부파일 스트림을 열 수 없습니다.");
        }
    }

    @Override
    public void deleteQuietly(MediaFile.Visibility visibility, String relativeKey) {
        try {
            Path baseRoot = resolveRoot(visibility);
            Path target = baseRoot.resolve(relativeKey).normalize();
            if (target.startsWith(baseRoot)) {
                Files.deleteIfExists(target);
            }
        } catch (IOException ignored) {
        }
    }

    public Path resolveRoot(MediaFile.Visibility visibility) {
        String dir = visibility == MediaFile.Visibility.PUBLIC
                ? starterProperties.storage().publicDir()
                : starterProperties.storage().privateDir();
        return Paths.get(dir).toAbsolutePath().normalize();
    }
}

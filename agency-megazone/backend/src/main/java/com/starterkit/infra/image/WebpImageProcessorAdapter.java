package com.starterkit.infra.image;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sksamuel.scrimage.ImmutableImage;
import com.sksamuel.scrimage.webp.WebpWriter;
import com.starterkit.common.exception.BusinessException;
import com.starterkit.common.exception.ErrorCode;
import com.starterkit.domain.media.ImageProcessPort;
import com.starterkit.domain.media.MediaFile;
import com.starterkit.domain.media.MediaFileRepository;
import com.starterkit.infra.config.StarterProperties;
import com.starterkit.infra.storage.LocalStorageAdapter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Component;
import org.springframework.transaction.support.TransactionTemplate;

import javax.imageio.ImageIO;
import javax.imageio.ImageReader;
import javax.imageio.stream.ImageInputStream;
import java.io.ByteArrayInputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.RejectedExecutionException;

/**
 * 1. TwelveMonkeys ImageReader로 전체 디코딩 없이 헤더만 스캔하여 4096x4096 초과 Image Bomb 차단
 * 2. 가상 스레드가 아닌 단일 플랫폼 스레드 풀(Pool=1, Q=50)에서 360/768/1920px WebP 다이어트 수행
 */
@Slf4j
@Component
public class WebpImageProcessorAdapter implements ImageProcessPort {

    private final ExecutorService imagePlatformExecutor;
    private final StarterProperties starterProperties;
    private final LocalStorageAdapter localStorageAdapter;
    private final MediaFileRepository mediaFileRepository;
    private final TransactionTemplate transactionTemplate;
    private final ObjectMapper objectMapper;

    public WebpImageProcessorAdapter(
            @Qualifier("imagePlatformExecutor") ExecutorService imagePlatformExecutor,
            StarterProperties starterProperties,
            LocalStorageAdapter localStorageAdapter,
            MediaFileRepository mediaFileRepository,
            TransactionTemplate transactionTemplate,
            ObjectMapper objectMapper) {
        this.imagePlatformExecutor = imagePlatformExecutor;
        this.starterProperties = starterProperties;
        this.localStorageAdapter = localStorageAdapter;
        this.mediaFileRepository = mediaFileRepository;
        this.transactionTemplate = transactionTemplate;
        this.objectMapper = objectMapper;
    }

    @Override
    public void inspectDimensionsOrThrow(byte[] imageBytes) {
        int maxDim = starterProperties.imageWorker().maxPixelDimension() > 0
                ? starterProperties.imageWorker().maxPixelDimension()
                : 4096;

        try (ImageInputStream iis = ImageIO.createImageInputStream(new ByteArrayInputStream(imageBytes))) {
            Iterator<ImageReader> readers = ImageIO.getImageReaders(iis);
            if (!readers.hasNext()) {
                throw new BusinessException(ErrorCode.UNSUPPORTED_MEDIA_TYPE, "지원하지 않는 이미지 포맷입니다.");
            }
            ImageReader reader = readers.next();
            try {
                reader.setInput(iis, true, true);
                int width = reader.getWidth(0);
                int height = reader.getHeight(0);
                if (width > maxDim || height > maxDim || width <= 0 || height <= 0) {
                    throw new BusinessException(
                            ErrorCode.IMAGE_DIMENSION_EXCEEDED,
                            String.format("이미지 해상도(%dx%d)가 허용 상한(%dx%d)을 초과했습니다.", width, height, maxDim, maxDim)
                    );
                }
            } finally {
                reader.dispose();
            }
        } catch (BusinessException be) {
            throw be;
        } catch (Exception e) {
            throw new BusinessException(ErrorCode.UNSUPPORTED_MEDIA_TYPE, "이미지 헤더를 읽을 수 없습니다.");
        }
    }

    @Override
    public void submitPublicImageDietJob(Long mediaFileId, Path rawTempFile, String baseRelativeDir, String fileStem) {
        try {
            imagePlatformExecutor.submit(() -> processWebpVariants(mediaFileId, rawTempFile, baseRelativeDir, fileStem));
        } catch (RejectedExecutionException rex) {
            try {
                Files.deleteIfExists(rawTempFile);
            } catch (Exception ignored) {
            }
            throw new BusinessException(ErrorCode.IMAGE_QUEUE_FULL);
        }
    }

    private void processWebpVariants(Long mediaFileId, Path rawTempFile, String baseRelativeDir, String fileStem) {
        try {
            ImmutableImage source = ImmutableImage.loader().fromPath(rawTempFile);
            int origWidth = source.width;
            int origHeight = source.height;

            Path publicRoot = localStorageAdapter.resolveRoot(MediaFile.Visibility.PUBLIC);
            Path targetDir = publicRoot.resolve(baseRelativeDir);
            Files.createDirectories(targetDir);

            Map<String, String> variants = new LinkedHashMap<>();
            int[] widths = {360, 768, 1920};
            String[] labels = {"THUMBNAIL", "MEDIUM", "LARGE"};

            for (int i = 0; i < widths.length; i++) {
                int targetWidth = Math.min(origWidth, widths[i]);
                ImmutableImage resized = origWidth > targetWidth ? source.scaleToWidth(targetWidth) : source;
                String fileName = fileStem + "_" + widths[i] + ".webp";
                Path outPath = targetDir.resolve(fileName);
                resized.output(WebpWriter.DEFAULT, outPath);
                variants.put(labels[i], "/uploads/public/" + baseRelativeDir + "/" + fileName);
            }

            String blurHash = computeCompactColorPlaceholder(source);
            String variantsJson = objectMapper.writeValueAsString(variants);
            String primaryUrl = variants.get("LARGE");

            transactionTemplate.executeWithoutResult(status ->
                    mediaFileRepository.findById(mediaFileId).ifPresent(mf ->
                            mf.markReady(origWidth, origHeight, blurHash, variantsJson, primaryUrl)
                    )
            );
            log.info("[ImageWebpWorker] Completed WebP diet for mediaFileId={}", mediaFileId);
        } catch (Exception e) {
            log.error("[ImageWebpWorker] Failed WebP diet for mediaFileId={}", mediaFileId, e);
            transactionTemplate.executeWithoutResult(status ->
                    mediaFileRepository.findById(mediaFileId).ifPresent(MediaFile::markFailed)
            );
        } finally {
            try {
                Files.deleteIfExists(rawTempFile);
            } catch (Exception ignored) {
            }
        }
    }

    private String computeCompactColorPlaceholder(ImmutableImage image) {
        ImmutableImage tiny = image.scaleTo(4, 4);
        java.awt.Color c = tiny.awt().getRGB(0, 0) != 0
                ? new java.awt.Color(tiny.awt().getRGB(2, 2))
                : java.awt.Color.GRAY;
        return String.format("L#%02X%02X%02X", c.getRed(), c.getGreen(), c.getBlue());
    }
}

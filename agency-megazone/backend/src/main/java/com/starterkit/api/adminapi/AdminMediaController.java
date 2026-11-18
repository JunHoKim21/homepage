package com.starterkit.api.adminapi;

import com.starterkit.common.response.ApiResponse;
import com.starterkit.common.security.AuthenticatedPrincipal;
import com.starterkit.domain.media.MediaService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.List;

@RestController
@RequestMapping("/api/admin/media")
@RequiredArgsConstructor
public class AdminMediaController {

    private final MediaService mediaService;

    @PostMapping("/upload")
    @ResponseStatus(HttpStatus.ACCEPTED)
    public ApiResponse<MediaService.MediaUploadResult> uploadPublicImage(
            @RequestParam("file") MultipartFile file,
            @AuthenticationPrincipal AuthenticatedPrincipal principal) throws IOException {
        String uploader = principal != null ? principal.identifier() : "ADMIN";
        return ApiResponse.ok(mediaService.uploadPublicImage(
                file.getOriginalFilename(),
                file.getContentType(),
                file.getBytes(),
                uploader
        ));
    }

    @GetMapping
    public ApiResponse<List<MediaService.MediaUploadResult>> listPublicMedia() {
        return ApiResponse.ok(mediaService.listPublicMedia());
    }

    /**
     * 비공개 첨부파일(/uploads/private)은 외부 URL 직접 접근이 차단되며,
     * 오직 관리자 인가를 통과한 후 본 스트리밍 API를 통해서만 안전하게 다운로드됩니다.
     */
    @GetMapping("/{mediaId}/download")
    public ResponseEntity<InputStreamResource> downloadPrivateAttachment(@PathVariable Long mediaId) {
        MediaService.PrivateMediaStreamResult result = mediaService.openPrivateAttachmentForAdmin(mediaId);
        ContentDisposition disposition = ContentDisposition.attachment()
                .filename(result.originalFilename(), StandardCharsets.UTF_8)
                .build();

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, disposition.toString())
                .header(HttpHeaders.CACHE_CONTROL, "no-store")
                .contentLength(result.fileSize())
                .contentType(MediaType.parseMediaType(result.contentType()))
                .body(new InputStreamResource(result.inputStream()));
    }
}

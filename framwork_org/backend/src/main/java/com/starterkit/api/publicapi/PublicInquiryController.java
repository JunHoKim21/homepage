package com.starterkit.api.publicapi;

import com.starterkit.common.response.ApiResponse;
import com.starterkit.domain.inquiry.InquiryService;
import com.starterkit.domain.media.MediaService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/v1/inquiries")
@RequiredArgsConstructor
public class PublicInquiryController {

    private final InquiryService inquiryService;
    private final MediaService mediaService;

    public record SubmitInquiryPayload(
            String category,
            @NotBlank String customerName,
            @NotBlank String customerPhone,
            String customerEmail,
            @NotBlank String title,
            @NotBlank String content,
            String customFieldsJson,
            Long attachmentMediaId,
            boolean privacyAgreed,
            String websiteUrl // Honeypot 숨김 필드
    ) {}

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<InquiryService.InquiryDetailResult> submitInquiry(
            @Valid @RequestBody SubmitInquiryPayload p,
            HttpServletRequest request) {
        return ApiResponse.ok(inquiryService.submitInquiry(new InquiryService.SubmitInquiryCommand(
                p.category(),
                p.customerName(),
                p.customerPhone(),
                p.customerEmail(),
                p.title(),
                p.content(),
                p.customFieldsJson(),
                p.attachmentMediaId(),
                p.privacyAgreed(),
                p.websiteUrl(),
                request.getRemoteAddr()
        )));
    }

    @PostMapping("/attachment")
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<MediaService.MediaUploadResult> uploadPrivateInquiryAttachment(
            @RequestParam("file") MultipartFile file,
            HttpServletRequest request) throws IOException {
        return ApiResponse.ok(mediaService.uploadPrivateAttachment(
                file.getOriginalFilename(),
                file.getContentType(),
                file.getBytes(),
                request.getRemoteAddr()
        ));
    }
}

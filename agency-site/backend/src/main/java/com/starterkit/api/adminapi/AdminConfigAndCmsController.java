package com.starterkit.api.adminapi;

import com.starterkit.common.response.ApiResponse;
import com.starterkit.common.security.AuthenticatedPrincipal;
import com.starterkit.domain.cms.CmsContent;
import com.starterkit.domain.cms.CmsContentService;
import com.starterkit.domain.cms.SiteConfigService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminConfigAndCmsController {

    private final SiteConfigService siteConfigService;
    private final CmsContentService cmsContentService;

    public record BatchUpdateConfigPayload(
            @NotEmpty List<SiteConfigService.ConfigUpdateCommand> configs
    ) {}

    public record SaveCmsPayload(
            @NotBlank String slug,
            @NotNull CmsContent.CmsCategory category,
            @NotBlank String title,
            String summary,
            String contentHtml,
            String thumbnailUrl,
            String extraJson,
            boolean isPinned,
            boolean isPublished
    ) {}

    @GetMapping("/configs")
    public ApiResponse<List<SiteConfigService.SiteConfigItemResult>> listAllConfigs() {
        return ApiResponse.ok(siteConfigService.getAllConfigsForAdmin());
    }

    @PutMapping("/configs")
    public ApiResponse<List<SiteConfigService.SiteConfigItemResult>> updateConfigs(
            @Valid @RequestBody BatchUpdateConfigPayload p,
            @AuthenticationPrincipal AuthenticatedPrincipal principal) {
        String actor = principal != null ? principal.identifier() : "ADMIN";
        return ApiResponse.ok(siteConfigService.updateConfigsBatch(p.configs(), actor));
    }

    @DeleteMapping("/configs/{configKey}")
    public ApiResponse<Void> deleteConfig(@PathVariable String configKey) {
        siteConfigService.deleteConfig(configKey);
        return ApiResponse.ok();
    }

    @GetMapping("/cms")
    public ApiResponse<List<CmsContentService.CmsContentResult>> listCmsByCategory(
            @RequestParam(defaultValue = "NOTICE") CmsContent.CmsCategory category) {
        return ApiResponse.ok(cmsContentService.getAllByCategoryForAdmin(category));
    }

    @PostMapping("/cms")
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<CmsContentService.CmsContentResult> createCmsContent(
            @Valid @RequestBody SaveCmsPayload p,
            @AuthenticationPrincipal AuthenticatedPrincipal principal) {
        String author = principal != null ? principal.identifier() : "ADMIN";
        return ApiResponse.ok(cmsContentService.createContent(new CmsContentService.SaveCmsContentCommand(
                p.slug(), p.category(), p.title(), p.summary(),
                p.contentHtml(), p.thumbnailUrl(), p.extraJson(), p.isPinned(), p.isPublished()
        ), author));
    }

    @PutMapping("/cms/{id}")
    public ApiResponse<CmsContentService.CmsContentResult> updateCmsContent(
            @PathVariable Long id,
            @Valid @RequestBody SaveCmsPayload p) {
        return ApiResponse.ok(cmsContentService.updateContent(id, new CmsContentService.SaveCmsContentCommand(
                p.slug(), p.category(), p.title(), p.summary(),
                p.contentHtml(), p.thumbnailUrl(), p.extraJson(), p.isPinned(), p.isPublished()
        )));
    }

    @DeleteMapping("/cms/{id}")
    public ApiResponse<Void> deleteCmsContent(@PathVariable Long id) {
        cmsContentService.deleteContent(id);
        return ApiResponse.ok();
    }
}

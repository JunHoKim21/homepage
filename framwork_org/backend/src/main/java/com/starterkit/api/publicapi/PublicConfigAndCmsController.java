package com.starterkit.api.publicapi;

import com.starterkit.common.response.ApiResponse;
import com.starterkit.domain.cms.CmsContent;
import com.starterkit.domain.cms.CmsContentService;
import com.starterkit.domain.cms.SiteConfigService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class PublicConfigAndCmsController {

    private final SiteConfigService siteConfigService;
    private final CmsContentService cmsContentService;

    @GetMapping("/configs/public")
    public ApiResponse<Map<String, String>> getPublicSiteConfigs() {
        return ApiResponse.ok(siteConfigService.getPublicConfigsMap());
    }

    @GetMapping("/cms/{category}")
    public ApiResponse<List<CmsContentService.CmsContentResult>> listPublishedContents(
            @PathVariable CmsContent.CmsCategory category) {
        return ApiResponse.ok(cmsContentService.getPublishedByCategory(category));
    }

    @GetMapping("/cms/{category}/{slug}")
    public ApiResponse<CmsContentService.CmsContentResult> getPublishedDetail(
            @PathVariable CmsContent.CmsCategory category,
            @PathVariable String slug) {
        return ApiResponse.ok(cmsContentService.getPublishedDetailBySlug(category, slug));
    }
}

package com.starterkit.domain.cms;

import com.starterkit.common.exception.BusinessException;
import com.starterkit.common.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.Cache;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

import java.time.OffsetDateTime;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class SiteConfigService {

    private static final String SITE_CONFIGS_CACHE = "siteConfigs";
    private static final String REVALIDATE_TAG = "site-configs";

    private final SiteConfigRepository siteConfigRepository;
    private final CacheManager cacheManager;
    private final ApplicationEventPublisher eventPublisher;
    private final CacheInvalidationPort cacheInvalidationPort;

    public record SiteConfigItemResult(
            String configKey,
            String configValue,
            String valueType,
            String groupName,
            String description,
            boolean isPublic,
            boolean isSystem,
            String updatedBy,
            OffsetDateTime updatedAt
    ) {}

    public record ConfigUpdateCommand(
            String configKey,
            String configValue
    ) {}

    @Cacheable(cacheNames = SITE_CONFIGS_CACHE, key = "'publicMap'")
    @Transactional(readOnly = true)
    public Map<String, String> getPublicConfigsMap() {
        List<SiteConfig> configs = siteConfigRepository.findByPublicVisibleTrueOrderByGroupNameAscConfigKeyAsc();
        Map<String, String> result = new LinkedHashMap<>();
        for (SiteConfig config : configs) {
            result.put(config.getConfigKey(), config.getConfigValue());
        }
        return result;
    }

    @Transactional(readOnly = true)
    public Optional<String> findConfigValue(String configKey) {
        return siteConfigRepository.findById(configKey).map(SiteConfig::getConfigValue);
    }

    @Transactional(readOnly = true)
    public List<SiteConfigItemResult> getAllConfigsForAdmin() {
        return siteConfigRepository.findAllByOrderByGroupNameAscConfigKeyAsc()
                .stream()
                .map(this::toResult)
                .toList();
    }

    @Transactional
    public List<SiteConfigItemResult> updateConfigsBatch(List<ConfigUpdateCommand> commands, String actor) {
        for (ConfigUpdateCommand cmd : commands) {
            SiteConfig config = siteConfigRepository.findById(cmd.configKey())
                    .orElseThrow(() -> new BusinessException(ErrorCode.RESOURCE_NOT_FOUND, "존재하지 않는 설정 키: " + cmd.configKey()));
            config.updateValue(cmd.configValue(), actor);
        }
        eventPublisher.publishEvent(new SiteConfigUpdatedEvent(REVALIDATE_TAG));
        return getAllConfigsForAdmin();
    }

    @Transactional
    public void deleteConfig(String configKey) {
        SiteConfig config = siteConfigRepository.findById(configKey)
                .orElseThrow(() -> new BusinessException(ErrorCode.RESOURCE_NOT_FOUND));
        config.validateDeletable(); // is_system = true 일 경우 403 SYSTEM_LOCKED_RESOURCE 예외 발생
        siteConfigRepository.delete(config);
        eventPublisher.publishEvent(new SiteConfigUpdatedEvent(REVALIDATE_TAG));
    }

    /**
     * PostgreSQL 트랜잭션이 완전히 커밋된 직후(AFTER_COMMIT) 로컬 Caffeine 캐시를 비우고
     * Next.js 프론트엔드에 On-Demand Revalidation 신호를 즉시 전송합니다.
     */
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void onConfigUpdatedAfterCommit(SiteConfigUpdatedEvent event) {
        Cache cache = cacheManager.getCache(SITE_CONFIGS_CACHE);
        if (cache != null) {
            cache.clear();
        }
        cacheInvalidationPort.revalidateNextJsTag(event.tag());
    }

    private SiteConfigItemResult toResult(SiteConfig c) {
        return new SiteConfigItemResult(
                c.getConfigKey(),
                c.getConfigValue(),
                c.getValueType(),
                c.getGroupName(),
                c.getDescription(),
                c.isPublicVisible(),
                c.isSystem(),
                c.getUpdatedBy(),
                c.getUpdatedAt()
        );
    }
}

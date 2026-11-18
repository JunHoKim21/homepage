package com.starterkit.infra.notification;

import com.starterkit.domain.cms.CacheInvalidationPort;
import com.starterkit.infra.config.StarterProperties;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import java.util.Map;

@Slf4j
@Component
@RequiredArgsConstructor
public class NextJsCacheInvalidationAdapter implements CacheInvalidationPort {

    private static final String SECRET_HEADER = "X-Revalidate-Secret";

    private final StarterProperties starterProperties;
    private final RestClient restClient = RestClient.builder()
            .requestFactory(new SimpleClientHttpRequestFactory())
            .build();

    @Override
    public void revalidateNextJsTag(String tag) {
        String url = starterProperties.revalidate().url();
        String secret = starterProperties.revalidate().secret();
        if (url == null || url.isBlank()) {
            return;
        }
        try {
            restClient.post()
                    .uri(url)
                    .header(SECRET_HEADER, secret)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(Map.of("tag", tag))
                    .retrieve()
                    .toBodilessEntity();
            log.info("[Next.js Revalidated] tag={}, url={}", tag, url);
        } catch (Exception e) {
            log.warn("[Next.js Revalidate Skip/Warn] tag={}, reason={}", tag, e.getMessage());
        }
    }
}

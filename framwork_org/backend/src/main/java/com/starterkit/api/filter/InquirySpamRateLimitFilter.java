package com.starterkit.api.filter;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.github.benmanes.caffeine.cache.Cache;
import com.github.benmanes.caffeine.cache.Caffeine;
import com.starterkit.common.exception.ErrorCode;
import com.starterkit.common.response.ApiResponse;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * 상담 문의(POST /api/v1/inquiries)에 대한 Caffeine 내장 메모리 기반 IP Rate Limit 필터.
 * 동일 IP에서 1분 내 설정 횟수(기본 3회) 초과 요청 시 DB 조회나 알림톡 발송 전에 429로 즉시 차단합니다.
 */
@Component
public class InquirySpamRateLimitFilter extends OncePerRequestFilter {

    private final Cache<String, AtomicInteger> minuteCounterCache = Caffeine.newBuilder()
            .expireAfterWrite(Duration.ofMinutes(1))
            .maximumSize(10_000)
            .build();

    private final ObjectMapper objectMapper;
    private final int maxInquiryPerMinute;

    public InquirySpamRateLimitFilter(
            ObjectMapper objectMapper,
            @Value("${starter.rate-limit.inquiry-per-minute:3}") int maxInquiryPerMinute) {
        this.objectMapper = objectMapper;
        this.maxInquiryPerMinute = Math.max(1, maxInquiryPerMinute);
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        return !("POST".equalsIgnoreCase(request.getMethod())
                && "/api/v1/inquiries".equals(request.getRequestURI()));
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        String clientIp = request.getRemoteAddr() != null ? request.getRemoteAddr() : "unknown";
        AtomicInteger counter = minuteCounterCache.get(clientIp, k -> new AtomicInteger(0));

        if (counter.incrementAndGet() > maxInquiryPerMinute) {
            response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
            response.setCharacterEncoding(StandardCharsets.UTF_8.name());
            response.setContentType(MediaType.APPLICATION_JSON_VALUE);
            objectMapper.writeValue(
                    response.getWriter(),
                    ApiResponse.error(ErrorCode.TOO_MANY_REQUESTS.getCode(), ErrorCode.TOO_MANY_REQUESTS.getMessage())
            );
            return;
        }

        filterChain.doFilter(request, response);
    }
}

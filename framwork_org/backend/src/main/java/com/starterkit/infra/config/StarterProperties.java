package com.starterkit.infra.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "starter")
public record StarterProperties(
        Jwt jwt,
        Revalidate revalidate,
        Storage storage,
        ImageWorker imageWorker,
        RateLimit rateLimit,
        Features features
) {
    public record Jwt(
            String secret,
            long accessTokenValiditySeconds,
            long refreshTokenValiditySeconds,
            long graceWindowSeconds
    ) {}

    public record Revalidate(
            String url,
            String secret
    ) {}

    public record Storage(
            String type,
            String publicDir,
            String privateDir
    ) {}

    public record ImageWorker(
            int corePoolSize,
            int queueCapacity,
            int maxPixelDimension
    ) {}

    public record RateLimit(
            int inquiryPerMinute
    ) {}

    public record Features(
            ReservationMode reservationMode,
            ReservationCapacityMode reservationCapacityMode,
            int reservationDefaultCapacity,
            boolean paymentEnabled,
            boolean auditLogEnabled,
            boolean excelExportEnabled,
            boolean adminTotpEnabled
    ) {}

    public enum ReservationMode {
        OFF, NAVER, INTERNAL, BOTH
    }

    public enum ReservationCapacityMode {
        SINGLE, MULTI
    }
}

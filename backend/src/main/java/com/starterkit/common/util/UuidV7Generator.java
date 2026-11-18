package com.starterkit.common.util;

import java.security.SecureRandom;
import java.time.Instant;
import java.util.UUID;

/**
 * RFC 9562 표준 기반 UUIDv7 (Time-ordered UUID) 생성기.
 * 외부 서드파티 의존성 없이 순수 Java 표준 라이브러리로 구현하여 100% 라이선스 클린을 보장합니다.
 */
public final class UuidV7Generator {

    private static final SecureRandom SECURE_RANDOM = new SecureRandom();

    private UuidV7Generator() {
    }

    public static UUID generate() {
        long timestampMs = Instant.now().toEpochMilli();
        byte[] randomBytes = new byte[10];
        SECURE_RANDOM.nextBytes(randomBytes);

        // Most significant 64 bits: 48-bit unix_ts_ms + 4-bit version(0111) + 12-bit rand_a
        long msb = (timestampMs & 0xFFFFFFFFFFFFL) << 16;
        msb |= 0x7000L; // Version 7
        msb |= ((randomBytes[0] & 0x0FL) << 8) | (randomBytes[1] & 0xFFL);

        // Least significant 64 bits: 2-bit variant(10) + 62-bit rand_b
        long lsb = 0L;
        for (int i = 2; i < 10; i++) {
            lsb = (lsb << 8) | (randomBytes[i] & 0xFFL);
        }
        lsb = (lsb & 0x3FFFFFFFFFFFFFFFL) | 0x8000000000000000L; // IETF variant (10xx)

        return new UUID(msb, lsb);
    }
}

package com.starterkit.common.security;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.ByteBuffer;
import java.time.Instant;

/**
 * RFC 6238 표준 Google OTP (TOTP) 검증기.
 * 외부 GPL/상용 라이브러리 의존 없이 Java 표준 JCE(HmacSHA1)로 구현하여 100% 라이선스 클린을 보장합니다.
 */
public final class TotpVerifier {

    private static final String BASE32_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
    private static final long TIME_STEP_SECONDS = 30L;

    private TotpVerifier() {
    }

    public static boolean verify(String base32Secret, String codeInput) {
        if (base32Secret == null || base32Secret.isBlank() || codeInput == null || !codeInput.matches("\\d{6}")) {
            return false;
        }
        int expectedCode = Integer.parseInt(codeInput);
        byte[] key = decodeBase32(base32Secret);
        long currentTimeWindow = Instant.now().getEpochSecond() / TIME_STEP_SECONDS;

        // 앞뒤 1개 윈도우(±30초 시간 오차) 허용
        for (int offset = -1; offset <= 1; offset++) {
            if (generateTotp(key, currentTimeWindow + offset) == expectedCode) {
                return true;
            }
        }
        return false;
    }

    private static int generateTotp(byte[] key, long timeWindow) {
        try {
            byte[] data = ByteBuffer.allocate(8).putLong(timeWindow).array();
            Mac mac = Mac.getInstance("HmacSHA1");
            mac.init(new SecretKeySpec(key, "HmacSHA1"));
            byte[] hash = mac.doFinal(data);

            int offset = hash[hash.length - 1] & 0x0F;
            int binary = ((hash[offset] & 0x7F) << 24)
                    | ((hash[offset + 1] & 0xFF) << 16)
                    | ((hash[offset + 2] & 0xFF) << 8)
                    | (hash[offset + 3] & 0xFF);
            return binary % 1_000_000;
        } catch (Exception e) {
            throw new IllegalStateException("Failed to verify TOTP", e);
        }
    }

    private static byte[] decodeBase32(String base32) {
        String clean = base32.trim().replace("=", "").replace(" ", "").toUpperCase();
        byte[] result = new byte[clean.length() * 5 / 8];
        int buffer = 0;
        int bitsLeft = 0;
        int index = 0;
        for (char c : clean.toCharArray()) {
            int val = BASE32_CHARS.indexOf(c);
            if (val < 0) {
                throw new IllegalArgumentException("Invalid Base32 character: " + c);
            }
            buffer = (buffer << 5) | val;
            bitsLeft += 5;
            if (bitsLeft >= 8) {
                result[index++] = (byte) (buffer >> (bitsLeft - 8));
                bitsLeft -= 8;
            }
        }
        return result;
    }
}

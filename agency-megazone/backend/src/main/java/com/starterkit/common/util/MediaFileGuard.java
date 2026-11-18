package com.starterkit.common.util;

import com.starterkit.common.exception.BusinessException;
import com.starterkit.common.exception.ErrorCode;

import java.nio.charset.StandardCharsets;
import java.util.Locale;

/**
 * 업로드 파일의 첫 64바이트(Magic Bytes)를 검사하여 악성 SVG(XSS), 스크립트, 실행 파일을 원천 차단합니다.
 */
public final class MediaFileGuard {

    private MediaFileGuard() {
    }

    public static void validateMagicBytes(byte[] headerBytes, boolean requireImageOnly) {
        if (headerBytes == null || headerBytes.length < 4) {
            throw new BusinessException(ErrorCode.UNSUPPORTED_MEDIA_TYPE, "비어 있거나 손상된 파일입니다.");
        }

        int inspectLen = Math.min(headerBytes.length, 64);
        String asciiHeader = new String(headerBytes, 0, inspectLen, StandardCharsets.ISO_8859_1)
                .toLowerCase(Locale.ROOT);

        // 1. SVG, XML, HTML, Script 및 Windows/Linux 실행 파일 시그니처 원천 차단
        if (asciiHeader.contains("<svg")
                || asciiHeader.contains("<?xml")
                || asciiHeader.contains("<script")
                || asciiHeader.contains("<html")
                || asciiHeader.contains("<!doctype")
                || (headerBytes[0] == 'M' && headerBytes[1] == 'Z')
                || (headerBytes[0] == 0x7F && headerBytes[1] == 'E' && headerBytes[2] == 'L' && headerBytes[3] == 'F')) {
            throw new BusinessException(ErrorCode.UNSUPPORTED_MEDIA_TYPE);
        }

        if (requireImageOnly && !isSupportedRasterImage(headerBytes)) {
            throw new BusinessException(ErrorCode.UNSUPPORTED_MEDIA_TYPE, "공개 이미지는 JPG, PNG, WEBP 형식만 허용됩니다.");
        }
    }

    public static boolean isSupportedRasterImage(byte[] b) {
        if (b == null || b.length < 12) {
            return false;
        }
        // JPEG: FF D8 FF
        boolean isJpeg = (b[0] & 0xFF) == 0xFF && (b[1] & 0xFF) == 0xD8 && (b[2] & 0xFF) == 0xFF;
        // PNG: 89 50 4E 47 0D 0A 1A 0A
        boolean isPng = (b[0] & 0xFF) == 0x89 && b[1] == 'P' && b[2] == 'N' && b[3] == 'G';
        // WEBP: RIFF....WEBP
        boolean isWebp = b[0] == 'R' && b[1] == 'I' && b[2] == 'F' && b[3] == 'F'
                && b[8] == 'W' && b[9] == 'E' && b[10] == 'B' && b[11] == 'P';

        return isJpeg || isPng || isWebp;
    }
}

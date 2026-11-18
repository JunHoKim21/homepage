package com.starterkit.infra.security;

import com.starterkit.common.security.AccessTokenParser;
import com.starterkit.common.security.AuthenticatedPrincipal;
import com.starterkit.domain.member.TokenIssuerPort;
import com.starterkit.infra.config.StarterProperties;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.security.SecureRandom;
import java.time.Instant;
import java.util.Base64;
import java.util.Collection;
import java.util.Date;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Component
public class JwtTokenProvider implements TokenIssuerPort, AccessTokenParser {

    private static final SecureRandom SECURE_RANDOM = new SecureRandom();

    private final SecretKey secretKey;
    private final StarterProperties starterProperties;

    public JwtTokenProvider(StarterProperties starterProperties) {
        this.starterProperties = starterProperties;
        String rawSecret = starterProperties.jwt().secret();
        if (rawSecret.getBytes(StandardCharsets.UTF_8).length < 32) {
            rawSecret = rawSecret + "_padding_for_hmac_sha256_minimum_32_bytes_key";
        }
        this.secretKey = Keys.hmacShaKeyFor(rawSecret.getBytes(StandardCharsets.UTF_8));
    }

    @Override
    public String createAccessToken(AuthenticatedPrincipal principal) {
        Instant now = Instant.now();
        Instant expiry = now.plusSeconds(getAccessTokenValiditySeconds());

        return Jwts.builder()
                .subject(String.valueOf(principal.subjectId()))
                .claim("type", principal.subjectType())
                .claim("idn", principal.identifier())
                .claim("auth", principal.authorities())
                .issuedAt(Date.from(now))
                .expiration(Date.from(expiry))
                .signWith(secretKey)
                .compact();
    }

    @Override
    public String generateOpaqueRefreshToken() {
        byte[] randomBytes = new byte[48];
        SECURE_RANDOM.nextBytes(randomBytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(randomBytes);
    }

    @Override
    public Optional<AuthenticatedPrincipal> parseAndValidate(String rawAccessToken) {
        try {
            Claims claims = Jwts.parser()
                    .verifyWith(secretKey)
                    .build()
                    .parseSignedClaims(rawAccessToken)
                    .getPayload();

            Long subjectId = Long.parseLong(claims.getSubject());
            String subjectType = claims.get("type", String.class);
            String identifier = claims.get("idn", String.class);
            Object authClaim = claims.get("auth");

            Set<String> authorities = Set.of();
            if (authClaim instanceof Collection<?> col) {
                authorities = col.stream().map(String::valueOf).collect(Collectors.toSet());
            }

            return Optional.of(new AuthenticatedPrincipal(subjectId, subjectType, identifier, authorities));
        } catch (JwtException | IllegalArgumentException e) {
            return Optional.empty();
        }
    }

    @Override
    public long getAccessTokenValiditySeconds() {
        return starterProperties.jwt().accessTokenValiditySeconds() > 0
                ? starterProperties.jwt().accessTokenValiditySeconds()
                : 1800L;
    }

    @Override
    public long getRefreshTokenValiditySeconds() {
        return starterProperties.jwt().refreshTokenValiditySeconds() > 0
                ? starterProperties.jwt().refreshTokenValiditySeconds()
                : 1209600L;
    }

    @Override
    public long getGraceWindowSeconds() {
        return starterProperties.jwt().graceWindowSeconds() > 0
                ? starterProperties.jwt().graceWindowSeconds()
                : 10L;
    }

    @Override
    public boolean isAdminTotpGloballyEnabled() {
        return starterProperties.features().adminTotpEnabled();
    }
}

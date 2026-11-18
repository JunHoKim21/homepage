package com.starterkit.domain.member;

import com.starterkit.common.security.AuthenticatedPrincipal;

public interface TokenIssuerPort {
    String createAccessToken(AuthenticatedPrincipal principal);
    String generateOpaqueRefreshToken();
    long getAccessTokenValiditySeconds();
    long getRefreshTokenValiditySeconds();
    long getGraceWindowSeconds();
    boolean isAdminTotpGloballyEnabled();
}

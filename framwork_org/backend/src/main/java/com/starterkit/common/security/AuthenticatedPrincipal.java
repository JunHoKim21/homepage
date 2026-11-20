package com.starterkit.common.security;

import java.util.Set;

public record AuthenticatedPrincipal(
        Long subjectId,
        String subjectType, // "MEMBER" or "ADMIN"
        String identifier,  // email or username
        Set<String> authorities
) {
    public boolean isAdmin() {
        return "ADMIN".equals(subjectType);
    }
}

package com.starterkit.common.security;

import java.util.Optional;

public interface AccessTokenParser {
    Optional<AuthenticatedPrincipal> parseAndValidate(String rawAccessToken);
}

package com.starterkit.api.adminapi;

import com.starterkit.common.response.ApiResponse;
import com.starterkit.domain.member.AuthService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/auth")
@RequiredArgsConstructor
public class AdminAuthController {

    private final AuthService authService;

    public record AdminSignInPayload(@NotBlank String username, @NotBlank String password, String totpCode) {}
    public record AdminTokenRefreshPayload(@NotBlank String refreshToken) {}

    @PostMapping("/login")
    public ApiResponse<AuthService.TokenPairResult> signInAdmin(@Valid @RequestBody AdminSignInPayload p) {
        return ApiResponse.ok(authService.loginAdmin(p.username(), p.password(), p.totpCode()));
    }

    @PostMapping("/refresh")
    public ApiResponse<AuthService.TokenPairResult> refreshAdminToken(@Valid @RequestBody AdminTokenRefreshPayload p) {
        return ApiResponse.ok(authService.rotateRefreshToken(p.refreshToken()));
    }
}

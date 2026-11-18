package com.starterkit.api.publicapi;

import com.starterkit.common.response.ApiResponse;
import com.starterkit.common.security.AuthenticatedPrincipal;
import com.starterkit.domain.member.AuthService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class PublicAuthController {

    private final AuthService authService;

    public record MemberSignupPayload(
            @NotBlank @Email String email,
            @NotBlank @Size(min = 8, max = 100) String password,
            @NotBlank @Size(max = 100) String nickname,
            String phoneNumber
    ) {}

    public record MemberLoginPayload(@NotBlank @Email String email, @NotBlank String password) {}
    public record TokenRotationPayload(@NotBlank String refreshToken) {}

    @PostMapping("/signup")
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<AuthService.MemberProfileResult> registerMember(@Valid @RequestBody MemberSignupPayload p) {
        return ApiResponse.ok(authService.signupMember(p.email(), p.password(), p.nickname(), p.phoneNumber()));
    }

    @PostMapping("/login")
    public ApiResponse<AuthService.TokenPairResult> authenticateMember(@Valid @RequestBody MemberLoginPayload p) {
        return ApiResponse.ok(authService.loginMember(p.email(), p.password()));
    }

    @PostMapping("/refresh")
    public ApiResponse<AuthService.TokenPairResult> rotateToken(@Valid @RequestBody TokenRotationPayload p) {
        return ApiResponse.ok(authService.rotateRefreshToken(p.refreshToken()));
    }

    @PostMapping("/logout")
    public ApiResponse<Void> revokeSession(@RequestBody(required = false) TokenRotationPayload p) {
        if (p != null) {
            authService.logoutByRefreshToken(p.refreshToken());
        }
        return ApiResponse.ok();
    }

    @GetMapping("/me")
    public ApiResponse<AuthService.MemberProfileResult> currentMemberProfile(
            @AuthenticationPrincipal AuthenticatedPrincipal principal) {
        return ApiResponse.ok(authService.getMemberProfile(principal.subjectId()));
    }
}

package com.starterkit.domain.member;

import com.starterkit.common.exception.BusinessException;
import com.starterkit.common.exception.ErrorCode;
import com.starterkit.common.security.AuthenticatedPrincipal;
import com.starterkit.common.security.TokenHashUtil;
import com.starterkit.common.security.TotpVerifier;
import com.starterkit.common.util.UuidV7Generator;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.Set;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final MemberRepository memberRepository;
    private final MemberOauthAccountRepository oauthAccountRepository;
    private final AdminRepository adminRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final TokenIssuerPort tokenIssuerPort;

    public record TokenPairResult(
            String accessToken,
            String refreshToken,
            long expiresInSeconds,
            AuthenticatedPrincipal principal
    ) {}

    public record MemberProfileResult(
            UUID publicId,
            String email,
            String nickname,
            String phoneNumber,
            String role
    ) {}

    @Transactional
    public MemberProfileResult signupMember(String email, String rawPassword, String nickname, String phoneNumber) {
        String normalizedEmail = email.trim().toLowerCase();
        if (memberRepository.existsByEmailAndDeletedAtIsNull(normalizedEmail)) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "이미 사용 중인 이메일입니다.");
        }

        Member member = Member.builder()
                .email(normalizedEmail)
                .passwordHash(passwordEncoder.encode(rawPassword))
                .nickname(nickname.trim())
                .phoneNumber(phoneNumber)
                .role(Member.MemberRole.USER)
                .build();

        Member saved = memberRepository.save(member);
        return toMemberProfile(saved);
    }

    @Transactional(noRollbackFor = BusinessException.class)
    public TokenPairResult loginMember(String email, String rawPassword) {
        String normalizedEmail = email.trim().toLowerCase();
        Member member = memberRepository.findByEmailAndDeletedAtIsNull(normalizedEmail)
                .orElseThrow(() -> new BusinessException(ErrorCode.UNAUTHORIZED, "이메일 또는 비밀번호가 올바르지 않습니다."));

        if (member.getStatus() != Member.MemberStatus.ACTIVE) {
            throw new BusinessException(ErrorCode.ACCESS_DENIED, "활성화되지 않은 계정입니다.");
        }

        if (member.getPasswordHash() == null || !passwordEncoder.matches(rawPassword, member.getPasswordHash())) {
            throw new BusinessException(ErrorCode.UNAUTHORIZED, "이메일 또는 비밀번호가 올바르지 않습니다.");
        }

        member.recordLogin();
        AuthenticatedPrincipal principal = buildMemberPrincipal(member);
        return issueNewTokenFamily(RefreshToken.SubjectType.MEMBER, member.getId(), principal);
    }

    @Transactional(noRollbackFor = BusinessException.class)
    public TokenPairResult loginAdmin(String username, String rawPassword, String totpCode) {
        Admin admin = adminRepository.findByUsernameAndDeletedAtIsNull(username.trim())
                .orElseThrow(() -> new BusinessException(ErrorCode.UNAUTHORIZED, "아이디 또는 비밀번호가 올바르지 않습니다."));

        if (admin.getStatus() == Admin.AdminStatus.LOCKED) {
            throw new BusinessException(ErrorCode.ACCOUNT_LOCKED);
        }

        if (!passwordEncoder.matches(rawPassword, admin.getPasswordHash())) {
            admin.recordLoginFailure();
            throw new BusinessException(ErrorCode.UNAUTHORIZED, "아이디 또는 비밀번호가 올바르지 않습니다.");
        }

        // Pro 확장 옵션: 관리자 Google OTP 2FA 활성화 시 검증
        if (tokenIssuerPort.isAdminTotpGloballyEnabled() && admin.isTotpEnabled()) {
            if (!TotpVerifier.verify(admin.getTotpSecret(), totpCode)) {
                admin.recordLoginFailure();
                throw new BusinessException(ErrorCode.INVALID_TOTP_CODE);
            }
        }

        admin.recordLoginSuccess();
        AuthenticatedPrincipal principal = buildAdminPrincipal(admin);
        return issueNewTokenFamily(RefreshToken.SubjectType.ADMIN, admin.getId(), principal);
    }

    /**
     * Valkey 없이 동작하는 PostgreSQL 기반 Refresh Token Rotation (RTR) + 10초 Grace Window.
     * - noRollbackFor = BusinessException.class 를 통해 탈취 감지 시 Family 전체 REVOKED 상태가 롤백되지 않고 커밋되도록 보장합니다.
     */
    @Transactional(noRollbackFor = BusinessException.class)
    public TokenPairResult rotateRefreshToken(String rawRefreshToken) {
        if (rawRefreshToken == null || rawRefreshToken.isBlank()) {
            throw new BusinessException(ErrorCode.INVALID_TOKEN);
        }

        String incomingHash = TokenHashUtil.sha256Hex(rawRefreshToken);
        OffsetDateTime now = OffsetDateTime.now();

        RefreshToken token = refreshTokenRepository.findByTokenHashForUpdate(incomingHash)
                .orElseThrow(() -> new BusinessException(ErrorCode.INVALID_TOKEN));

        if (token.isExpired(now) || token.getStatus() == RefreshToken.TokenStatus.REVOKED) {
            throw new BusinessException(ErrorCode.INVALID_TOKEN);
        }

        // 이미 USED 상태인 토큰이 재요청된 경우: 10초 Grace Window 검사
        if (token.getStatus() == RefreshToken.TokenStatus.USED) {
            long graceSeconds = tokenIssuerPort.getGraceWindowSeconds();
            if (token.isWithinGraceWindow(now, graceSeconds)) {
                log.info("[RTR Grace Window] familyId={}, subjectId={} within {}s grace window",
                        token.getFamilyId(), token.getSubjectId(), graceSeconds);
                AuthenticatedPrincipal principal = loadPrincipal(token.getSubjectType(), token.getSubjectId());

                // 직전 회전에서 생성된 ACTIVE 후속 토큰을 새 토큰으로 안전하게 교체하여 양쪽 탭 모두 정상 동작 보장
                RefreshToken currentActive = token.getReplacedByTokenHash() != null
                        ? refreshTokenRepository.findByTokenHashForUpdate(token.getReplacedByTokenHash()).orElse(null)
                        : null;

                String nextRawRefresh = tokenIssuerPort.generateOpaqueRefreshToken();
                String nextHash = TokenHashUtil.sha256Hex(nextRawRefresh);
                OffsetDateTime expiresAt = now.plusSeconds(tokenIssuerPort.getRefreshTokenValiditySeconds());

                if (currentActive != null && currentActive.getStatus() == RefreshToken.TokenStatus.ACTIVE) {
                    currentActive.markUsed(nextHash, now);
                }
                token.markUsed(nextHash, token.getUsedAt()); // 최초 usedAt 시각 유지

                refreshTokenRepository.save(RefreshToken.builder()
                        .familyId(token.getFamilyId())
                        .tokenHash(nextHash)
                        .subjectType(token.getSubjectType())
                        .subjectId(token.getSubjectId())
                        .expiresAt(expiresAt)
                        .build());

                String accessToken = tokenIssuerPort.createAccessToken(principal);
                return new TokenPairResult(accessToken, nextRawRefresh, tokenIssuerPort.getAccessTokenValiditySeconds(), principal);
            }

            // 10초 Grace Window 경과 후 재사용 -> 토큰 탈취 공격으로 판단하여 Family 전체 폐기
            log.warn("[RTR Security Alert] Token reuse detected! Revoking entire familyId={}", token.getFamilyId());
            refreshTokenRepository.revokeAllByFamilyId(token.getFamilyId());
            throw new BusinessException(ErrorCode.TOKEN_REUSE_DETECTED);
        }

        // 정상 ACTIVE 토큰 회전
        AuthenticatedPrincipal principal = loadPrincipal(token.getSubjectType(), token.getSubjectId());
        String newRawRefresh = tokenIssuerPort.generateOpaqueRefreshToken();
        String newHash = TokenHashUtil.sha256Hex(newRawRefresh);
        OffsetDateTime expiresAt = now.plusSeconds(tokenIssuerPort.getRefreshTokenValiditySeconds());

        token.markUsed(newHash, now);
        refreshTokenRepository.save(RefreshToken.builder()
                .familyId(token.getFamilyId())
                .tokenHash(newHash)
                .subjectType(token.getSubjectType())
                .subjectId(token.getSubjectId())
                .expiresAt(expiresAt)
                .build());

        String newAccessToken = tokenIssuerPort.createAccessToken(principal);
        return new TokenPairResult(newAccessToken, newRawRefresh, tokenIssuerPort.getAccessTokenValiditySeconds(), principal);
    }

    @Transactional
    public void logoutByRefreshToken(String rawRefreshToken) {
        if (rawRefreshToken == null || rawRefreshToken.isBlank()) {
            return;
        }
        String hash = TokenHashUtil.sha256Hex(rawRefreshToken);
        refreshTokenRepository.findByTokenHash(hash)
                .ifPresent(rt -> refreshTokenRepository.revokeAllByFamilyId(rt.getFamilyId()));
    }

    @Transactional(readOnly = true)
    public MemberProfileResult getMemberProfile(Long memberId) {
        Member member = memberRepository.findById(memberId)
                .filter(m -> m.getDeletedAt() == null)
                .orElseThrow(() -> new BusinessException(ErrorCode.RESOURCE_NOT_FOUND));
        return toMemberProfile(member);
    }

    private TokenPairResult issueNewTokenFamily(RefreshToken.SubjectType subjectType, Long subjectId, AuthenticatedPrincipal principal) {
        UUID familyId = UuidV7Generator.generate();
        String rawRefresh = tokenIssuerPort.generateOpaqueRefreshToken();
        String tokenHash = TokenHashUtil.sha256Hex(rawRefresh);
        OffsetDateTime expiresAt = OffsetDateTime.now().plusSeconds(tokenIssuerPort.getRefreshTokenValiditySeconds());

        refreshTokenRepository.save(RefreshToken.builder()
                .familyId(familyId)
                .tokenHash(tokenHash)
                .subjectType(subjectType)
                .subjectId(subjectId)
                .expiresAt(expiresAt)
                .build());

        String accessToken = tokenIssuerPort.createAccessToken(principal);
        return new TokenPairResult(accessToken, rawRefresh, tokenIssuerPort.getAccessTokenValiditySeconds(), principal);
    }

    private AuthenticatedPrincipal loadPrincipal(RefreshToken.SubjectType subjectType, Long subjectId) {
        if (subjectType == RefreshToken.SubjectType.MEMBER) {
            Member member = memberRepository.findById(subjectId)
                    .filter(m -> m.getDeletedAt() == null && m.getStatus() == Member.MemberStatus.ACTIVE)
                    .orElseThrow(() -> new BusinessException(ErrorCode.UNAUTHORIZED));
            return buildMemberPrincipal(member);
        } else {
            Admin admin = adminRepository.findById(subjectId)
                    .filter(a -> a.getDeletedAt() == null && a.getStatus() == Admin.AdminStatus.ACTIVE)
                    .orElseThrow(() -> new BusinessException(ErrorCode.UNAUTHORIZED));
            return buildAdminPrincipal(admin);
        }
    }

    private AuthenticatedPrincipal buildMemberPrincipal(Member member) {
        return new AuthenticatedPrincipal(
                member.getId(),
                RefreshToken.SubjectType.MEMBER.name(),
                member.getEmail(),
                Set.of("ROLE_" + member.getRole().name())
        );
    }

    private AuthenticatedPrincipal buildAdminPrincipal(Admin admin) {
        return new AuthenticatedPrincipal(
                admin.getId(),
                RefreshToken.SubjectType.ADMIN.name(),
                admin.getUsername(),
                admin.collectAllAuthorities()
        );
    }

    private MemberProfileResult toMemberProfile(Member member) {
        return new MemberProfileResult(
                member.getPublicId(),
                member.getEmail(),
                member.getNickname(),
                member.getPhoneNumber(),
                member.getRole().name()
        );
    }
}

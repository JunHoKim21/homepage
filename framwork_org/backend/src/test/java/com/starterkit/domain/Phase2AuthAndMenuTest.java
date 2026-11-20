package com.starterkit.domain;

import com.starterkit.common.exception.BusinessException;
import com.starterkit.common.exception.ErrorCode;
import com.starterkit.common.security.TokenHashUtil;
import com.starterkit.domain.cms.Menu;
import com.starterkit.domain.cms.MenuRepository;
import com.starterkit.domain.cms.MenuService;
import com.starterkit.domain.member.AdminRepository;
import com.starterkit.domain.member.AuthService;
import com.starterkit.domain.member.Member;
import com.starterkit.domain.member.MemberOauthAccountRepository;
import com.starterkit.domain.member.MemberRepository;
import com.starterkit.domain.member.RefreshToken;
import com.starterkit.domain.member.RefreshTokenRepository;
import com.starterkit.domain.member.TokenIssuerPort;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.util.ReflectionTestUtils;

import java.time.OffsetDateTime;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicInteger;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class Phase2AuthAndMenuTest {

    @Mock
    private MemberRepository memberRepository;
    @Mock
    private MemberOauthAccountRepository oauthAccountRepository;
    @Mock
    private AdminRepository adminRepository;
    @Mock
    private RefreshTokenRepository refreshTokenRepository;
    @Mock
    private TokenIssuerPort tokenIssuerPort;
    @Mock
    private MenuRepository menuRepository;

    private AuthService authService;
    private MenuService menuService;
    private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @BeforeEach
    void setUp() {
        authService = new AuthService(
                memberRepository,
                oauthAccountRepository,
                adminRepository,
                refreshTokenRepository,
                passwordEncoder,
                tokenIssuerPort
        );
        menuService = new MenuService(menuRepository);
    }

    @Test
    @DisplayName("10초 Grace Window 내 USED 토큰 재요청 시 Family를 폐기하지 않고 정상 토큰을 발급한다")
    void rotateRefreshToken_withinGraceWindow_succeeds() {
        String rawUsedToken = "used-token-raw";
        String usedHash = TokenHashUtil.sha256Hex(rawUsedToken);
        UUID familyId = UUID.randomUUID();

        RefreshToken usedToken = RefreshToken.builder()
                .familyId(familyId)
                .tokenHash(usedHash)
                .subjectType(RefreshToken.SubjectType.MEMBER)
                .subjectId(1L)
                .expiresAt(OffsetDateTime.now().plusDays(7))
                .build();
        usedToken.markUsed("active-next-hash", OffsetDateTime.now().minusSeconds(3)); // 3초 전 사용됨

        Member activeMember = Member.builder()
                .email("user@test.com")
                .nickname("테스터")
                .role(Member.MemberRole.USER)
                .build();
        ReflectionTestUtils.setField(activeMember, "id", 1L);

        AtomicInteger seq = new AtomicInteger(1);
        given(refreshTokenRepository.findByTokenHashForUpdate(usedHash)).willReturn(Optional.of(usedToken));
        given(refreshTokenRepository.findByTokenHashForUpdate("active-next-hash")).willReturn(Optional.empty());
        given(tokenIssuerPort.getGraceWindowSeconds()).willReturn(10L);
        given(tokenIssuerPort.generateOpaqueRefreshToken()).willAnswer(inv -> "new-refresh-" + seq.getAndIncrement());
        given(tokenIssuerPort.getRefreshTokenValiditySeconds()).willReturn(1209600L);
        given(tokenIssuerPort.getAccessTokenValiditySeconds()).willReturn(1800L);
        given(tokenIssuerPort.createAccessToken(any())).willReturn("new-access-jwt");
        given(memberRepository.findById(1L)).willReturn(Optional.of(activeMember));

        AuthService.TokenPairResult result = authService.rotateRefreshToken(rawUsedToken);

        assertThat(result.accessToken()).isEqualTo("new-access-jwt");
        assertThat(result.refreshToken()).isEqualTo("new-refresh-1");
    }

    @Test
    @DisplayName("10초 Grace Window 경과 후 USED 토큰 재사용 시 토큰 탈취로 간주하고 Family 전체를 REVOKED 처리한다")
    void rotateRefreshToken_afterGraceWindow_revokesEntireFamily() {
        String rawStolenToken = "stolen-used-token";
        String stolenHash = TokenHashUtil.sha256Hex(rawStolenToken);
        UUID familyId = UUID.randomUUID();

        RefreshToken usedToken = RefreshToken.builder()
                .familyId(familyId)
                .tokenHash(stolenHash)
                .subjectType(RefreshToken.SubjectType.MEMBER)
                .subjectId(1L)
                .expiresAt(OffsetDateTime.now().plusDays(7))
                .build();
        usedToken.markUsed("replaced-hash", OffsetDateTime.now().minusSeconds(25)); // 25초 경과 (10초 초과)

        given(refreshTokenRepository.findByTokenHashForUpdate(stolenHash)).willReturn(Optional.of(usedToken));
        given(tokenIssuerPort.getGraceWindowSeconds()).willReturn(10L);

        assertThatThrownBy(() -> authService.rotateRefreshToken(rawStolenToken))
                .isInstanceOf(BusinessException.class)
                .extracting(ex -> ((BusinessException) ex).getErrorCode())
                .isEqualTo(ErrorCode.TOKEN_REUSE_DETECTED);

        verify(refreshTokenRepository).revokeAllByFamilyId(familyId);
    }

    @Test
    @DisplayName("is_system = true 인 필수 시스템 메뉴 삭제 시도 시 403 SYSTEM_LOCKED_RESOURCE 예외로 차단한다")
    void deleteSystemMenu_throwsForbidden() {
        Menu systemMenu = Menu.builder()
                .menuType(Menu.MenuType.PUBLIC)
                .menuName("온라인 예약")
                .routePath("/reservations")
                .sortOrder(1)
                .visible(true)
                .system(true)
                .build();

        given(menuRepository.findById(10L)).willReturn(Optional.of(systemMenu));

        assertThatThrownBy(() -> menuService.deleteMenu(10L))
                .isInstanceOf(BusinessException.class)
                .extracting(ex -> ((BusinessException) ex).getErrorCode())
                .isEqualTo(ErrorCode.SYSTEM_LOCKED_RESOURCE);
    }
}

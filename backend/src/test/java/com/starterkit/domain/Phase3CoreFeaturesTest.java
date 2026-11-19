package com.starterkit.domain;

import com.starterkit.common.exception.BusinessException;
import com.starterkit.common.exception.ErrorCode;
import com.starterkit.common.util.MediaFileGuard;
import com.starterkit.domain.cms.CacheInvalidationPort;
import com.starterkit.domain.cms.SiteConfig;
import com.starterkit.domain.cms.SiteConfigRepository;
import com.starterkit.domain.cms.SiteConfigService;
import com.starterkit.domain.inquiry.InquiryRepository;
import com.starterkit.domain.inquiry.InquiryService;
import com.starterkit.domain.inquiry.NotificationPort;
import com.starterkit.domain.inquiry.OutboxEventRepository;
import com.starterkit.domain.reservation.ReservationRepository;
import com.starterkit.domain.reservation.ReservationService;
import com.starterkit.domain.reservation.ReservationSlot;
import com.starterkit.domain.reservation.ReservationSlotRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.cache.CacheManager;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.test.util.ReflectionTestUtils;

import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Map;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class Phase3CoreFeaturesTest {

    @Mock
    private SiteConfigRepository siteConfigRepository;
    @Mock
    private CacheManager cacheManager;
    @Mock
    private ApplicationEventPublisher eventPublisher;
    @Mock
    private CacheInvalidationPort cacheInvalidationPort;

    @Mock
    private InquiryRepository inquiryRepository;
    @Mock
    private OutboxEventRepository outboxEventRepository;
    @Mock
    private NotificationPort notificationPort;

    @Mock
    private ReservationSlotRepository slotRepository;
    @Mock
    private ReservationRepository reservationRepository;
    @Mock
    private SiteConfigService mockedSiteConfigService;

    private SiteConfigService siteConfigService;
    private InquiryService inquiryService;
    private ReservationService reservationService;

    @BeforeEach
    void setUp() {
        siteConfigService = new SiteConfigService(siteConfigRepository, cacheManager, eventPublisher, cacheInvalidationPort);
        inquiryService = new InquiryService(inquiryRepository, outboxEventRepository, eventPublisher, notificationPort);
        reservationService = new ReservationService(
                slotRepository, reservationRepository, mockedSiteConfigService, outboxEventRepository, eventPublisher
        );
    }

    @Test
    @DisplayName("[킬러 1] is_system = true 인 필수 SEO 설정(seo_title) 삭제 시도 시 403 SYSTEM_LOCKED_RESOURCE 예외 발생")
    void deleteSystemSiteConfig_throwsForbidden() {
        SiteConfig seoTitle = SiteConfig.builder()
                .configKey("seo_title")
                .configValue("표준 홈페이지")
                .groupName("SEO")
                .description("타이틀")
                .publicVisible(true)
                .system(true)
                .build();

        given(siteConfigRepository.findById("seo_title")).willReturn(Optional.of(seoTitle));

        assertThatThrownBy(() -> siteConfigService.deleteConfig("seo_title"))
                .isInstanceOf(BusinessException.class)
                .extracting(ex -> ((BusinessException) ex).getErrorCode())
                .isEqualTo(ErrorCode.SYSTEM_LOCKED_RESOURCE);
    }

    @Test
    @DisplayName("[킬러 2] Magic Bytes 검사 시 악성 SVG/스크립트 업로드를 UNSUPPORTED_MEDIA_TYPE으로 즉시 거부한다")
    void validateMagicBytes_blocksSvgAndScript() {
        byte[] maliciousSvg = "<svg onload=\"alert(1)\"><script>evil()</script></svg>".getBytes(StandardCharsets.UTF_8);

        assertThatThrownBy(() -> MediaFileGuard.validateMagicBytes(maliciousSvg, false))
                .isInstanceOf(BusinessException.class)
                .extracting(ex -> ((BusinessException) ex).getErrorCode())
                .isEqualTo(ErrorCode.UNSUPPORTED_MEDIA_TYPE);
    }

    @Test
    @DisplayName("[킬러 2] 공개 미디어 Magic Bytes 검사 시 MP4와 WEBM 동영상은 허용하고 비허용 바이너리/SVG는 차단한다")
    void validatePublicMediaMagicBytes_allowsMp4AndWebm_blocksInvalid() {
        byte[] validMp4 = new byte[]{0x00, 0x00, 0x00, 0x18, 'f', 't', 'y', 'p', 'm', 'p', '4', '2'};
        byte[] validWebm = new byte[]{0x1A, 0x45, (byte) 0xDF, (byte) 0xA3, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00};
        byte[] invalidText = "not-a-media-file-payload".getBytes(StandardCharsets.UTF_8);
        byte[] maliciousSvg = "<svg onload=\"alert(1)\"></svg>".getBytes(StandardCharsets.UTF_8);

        MediaFileGuard.validatePublicMediaMagicBytes(validMp4);
        MediaFileGuard.validatePublicMediaMagicBytes(validWebm);
        assertThat(MediaFileGuard.isMp4(validMp4)).isTrue();
        assertThat(MediaFileGuard.isWebm(validWebm)).isTrue();

        assertThatThrownBy(() -> MediaFileGuard.validatePublicMediaMagicBytes(invalidText))
                .isInstanceOf(BusinessException.class)
                .extracting(ex -> ((BusinessException) ex).getErrorCode())
                .isEqualTo(ErrorCode.UNSUPPORTED_MEDIA_TYPE);

        assertThatThrownBy(() -> MediaFileGuard.validatePublicMediaMagicBytes(maliciousSvg))
                .isInstanceOf(BusinessException.class)
                .extracting(ex -> ((BusinessException) ex).getErrorCode())
                .isEqualTo(ErrorCode.UNSUPPORTED_MEDIA_TYPE);
    }

    @Test
    @DisplayName("[킬러 3] 상담 문의 Honeypot(website_url) 필드에 값이 있으면 DB 저장 및 알림톡 발송을 0건으로 차단한다")
    void submitInquiry_withHoneypot_skipsDatabaseAndNotification() {
        InquiryService.SubmitInquiryCommand spamCommand = new InquiryService.SubmitInquiryCommand(
                "GENERAL", "스팸봇", "010-0000-0000", "bot@spam.com",
                "광고 제목", "광고 본문", "{}", null, true,
                "http://malicious-spam-bot.ru", "203.0.113.99"
        );

        InquiryService.InquiryDetailResult fakeResult = inquiryService.submitInquiry(spamCommand);

        assertThat(fakeResult.id()).isEqualTo(0L);
        verify(inquiryRepository, never()).save(any());
        verify(outboxEventRepository, never()).save(any());
    }

    @Test
    @DisplayName("[킬러 4] SINGLE(1:1 단독) 예약 모드에서 1건 예약 시 마감되며 추가 예약 시 409 Conflict가 발생한다")
    void reservation_singleMode_preventsSecondBooking() {
        given(mockedSiteConfigService.getPublicConfigsMap()).willReturn(Map.of(
                "reservation_mode", "INTERNAL",
                "reservation_capacity_mode", "SINGLE",
                "reservation_default_capacity", "1"
        ));

        ReservationSlot slot = ReservationSlot.builder()
                .slotDate(LocalDate.of(2026, 11, 25))
                .slotTime(LocalTime.of(14, 0))
                .serviceName("법률상담")
                .maxCapacity(5) // 슬롯 컬럼이 5여도 SINGLE 모드면 1명으로 강제 작동
                .closed(false)
                .build();
        ReflectionTestUtils.setField(slot, "id", 100L);

        given(slotRepository.findByIdForUpdate(100L)).willReturn(Optional.of(slot));
        given(reservationRepository.save(any())).willAnswer(inv -> inv.getArgument(0));
        given(outboxEventRepository.save(any())).willAnswer(inv -> inv.getArgument(0));

        // 첫 번째 예약 성공
        ReservationService.CreateReservationCommand firstCmd = new ReservationService.CreateReservationCommand(
                100L, null, "홍길동", "010-1111-2222", null, 1, "{}", null, "127.0.0.1"
        );
        reservationService.createReservation(firstCmd);
        assertThat(slot.getReservedCount()).isEqualTo(1);

        // 두 번째 예약 시도 -> 409 RESERVATION_CAPACITY_EXCEEDED
        ReservationService.CreateReservationCommand secondCmd = new ReservationService.CreateReservationCommand(
                100L, null, "이순신", "010-3333-4444", null, 1, "{}", null, "127.0.0.1"
        );
        assertThatThrownBy(() -> reservationService.createReservation(secondCmd))
                .isInstanceOf(BusinessException.class)
                .extracting(ex -> ((BusinessException) ex).getErrorCode())
                .isEqualTo(ErrorCode.RESERVATION_CAPACITY_EXCEEDED);
    }

    @Test
    @DisplayName("[킬러 4] MULTI(시간대별 N명 정원제) 모드에서 잔여 좌석 초과 예약 시 409 Conflict가 발생한다")
    void reservation_multiMode_enforcesMaxCapacity() {
        given(mockedSiteConfigService.getPublicConfigsMap()).willReturn(Map.of(
                "reservation_mode", "BOTH",
                "reservation_capacity_mode", "MULTI",
                "reservation_default_capacity", "5"
        ));

        ReservationSlot slot = ReservationSlot.builder()
                .slotDate(LocalDate.of(2026, 11, 25))
                .slotTime(LocalTime.of(15, 0))
                .serviceName("원데이클래스")
                .maxCapacity(5)
                .closed(false)
                .build();
        ReflectionTestUtils.setField(slot, "id", 200L);

        given(slotRepository.findByIdForUpdate(200L)).willReturn(Optional.of(slot));
        given(reservationRepository.save(any())).willAnswer(inv -> inv.getArgument(0));
        given(outboxEventRepository.save(any())).willAnswer(inv -> inv.getArgument(0));

        // 1차: 3명 예약 성공 (잔여 2석)
        reservationService.createReservation(new ReservationService.CreateReservationCommand(
                200L, null, "김철수", "010-1234-5678", null, 3, "{}", null, "127.0.0.1"
        ));
        assertThat(slot.getReservedCount()).isEqualTo(3);

        // 2차: 3명 추가 예약 시도 (3 + 3 = 6 > 5) -> 409 RESERVATION_CAPACITY_EXCEEDED
        assertThatThrownBy(() -> reservationService.createReservation(new ReservationService.CreateReservationCommand(
                200L, null, "박영희", "010-9876-5432", null, 3, "{}", null, "127.0.0.1"
        )))
                .isInstanceOf(BusinessException.class)
                .extracting(ex -> ((BusinessException) ex).getErrorCode())
                .isEqualTo(ErrorCode.RESERVATION_CAPACITY_EXCEEDED);
    }
}

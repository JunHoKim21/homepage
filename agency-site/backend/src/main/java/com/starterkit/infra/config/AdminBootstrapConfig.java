package com.starterkit.infra.config;

import com.starterkit.domain.inquiry.Inquiry;
import com.starterkit.domain.inquiry.InquiryRepository;
import com.starterkit.domain.member.Admin;
import com.starterkit.domain.member.AdminRepository;
import com.starterkit.domain.member.Role;
import com.starterkit.domain.member.RoleRepository;
import com.starterkit.domain.reservation.Reservation;
import com.starterkit.domain.reservation.ReservationRepository;
import com.starterkit.domain.reservation.ReservationSlot;
import com.starterkit.domain.reservation.ReservationSlotRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.support.TransactionTemplate;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Slf4j
@Configuration
@RequiredArgsConstructor
public class AdminBootstrapConfig {

    private final AdminRepository adminRepository;
    private final RoleRepository roleRepository;
    private final InquiryRepository inquiryRepository;
    private final ReservationSlotRepository reservationSlotRepository;
    private final ReservationRepository reservationRepository;
    private final PasswordEncoder passwordEncoder;
    private final TransactionTemplate transactionTemplate;

    @Bean
    public ApplicationRunner seedDefaultSuperAdminRunner() {
        return args -> transactionTemplate.executeWithoutResult(status -> {
            seedDefaultSuperAdmin();
            seedSampleInquiriesIfEmpty();
            seedSampleReservationsIfEmpty();
        });
    }

    private void seedDefaultSuperAdmin() {
        if (adminRepository.findByUsernameAndDeletedAtIsNull("admin").isEmpty()) {
            Role superAdminRole = roleRepository.findByRoleCode("ROLE_SUPER_ADMIN")
                    .orElseGet(() -> roleRepository.save(Role.builder()
                            .roleCode("ROLE_SUPER_ADMIN")
                            .roleName("최고 시스템 관리자")
                            .system(true)
                            .build()));

            Admin defaultAdmin = Admin.builder()
                    .username("admin")
                    .passwordHash(passwordEncoder.encode("Admin1234!"))
                    .fullName("스타터웹 총괄 디렉터")
                    .email("admin@starterweb.kr")
                    .totpEnabled(false)
                    .build();
            defaultAdmin.addRole(superAdminRole);
            adminRepository.save(defaultAdmin);
            log.info("[Bootstrap] Default super admin 'admin' initialized.");
        }
    }

    private void seedSampleInquiriesIfEmpty() {
        if (inquiryRepository.count() > 0) {
            return;
        }

        Inquiry inquiry1 = Inquiry.builder()
                .category("ESTIMATE")
                .customerName("(주)한빛정밀 김철수 대표")
                .customerPhone("010-2345-6789")
                .customerEmail("ceo@hanbit-mfg.co.kr")
                .title("제조업 회사소개 및 제품 카탈로그 반응형 홈페이지 견적 문의드립니다")
                .content("현재 오래된 홈페이지를 운영 중인데 모바일에서 깨져서 리뉴얼하려고 합니다. 관리자에서 제품 사진과 카탈로그 PDF를 직접 올릴 수 있는 구조와 네이버 검색 노출 세팅이 필요합니다.")
                .customFields("{\"budgetRange\":\"99만 원 (Deluxe)\",\"packageType\":\"DELUXE\",\"industry\":\"기업·제조\"}")
                .privacyAgreed(true)
                .clientIp("127.0.0.1")
                .build();

        Inquiry inquiry2 = Inquiry.builder()
                .category("ESTIMATE")
                .customerName("바른세무회계 박영희 세무사")
                .customerPhone("010-8765-4321")
                .customerEmail("tax@barun-tax.kr")
                .title("세무사 사무소 홈페이지 및 1:1 기장·양도세 상담 예약 기능 구축 문의")
                .content("기존 임대형 웹빌더를 사용 중인데 매월 발생하는 고정 비용과 예약 기능 커스텀 한계로 인해 독립형 홈페이지로 전환하려고 합니다. 1:1 시간대별 상담 예약과 카카오톡 알림 연동 가능한지 문의드립니다.")
                .customFields("{\"budgetRange\":\"99만 원 ~ 179만 원\",\"packageType\":\"DELUXE\",\"industry\":\"로펌·세무\"}")
                .privacyAgreed(true)
                .clientIp("127.0.0.1")
                .build();

        Inquiry inquiry3 = Inquiry.builder()
                .category("ESTIMATE")
                .customerName("연세미소치과의원 이준호 원장")
                .customerPhone("010-5555-7777")
                .customerEmail("director@ys-dental.kr")
                .title("병원 진료안내 및 네이버예약+자체예약 병행 홈페이지 제작 요청")
                .content("세금계산서 발행 가능한 업체 찾고 있습니다. 진료시간표와 의료진 소개, 오시는 길 약도 및 예약 기능이 필요합니다.")
                .customFields("{\"budgetRange\":\"179만 원 (Premium)\",\"packageType\":\"PREMIUM\",\"industry\":\"병의원·클리닉\"}")
                .privacyAgreed(true)
                .clientIp("127.0.0.1")
                .build();
        inquiry3.updateStatusAndMemo(
                Inquiry.InquiryStatus.COMPLETED,
                "유선 상담 완료 및 Deluxe 맞춤 견적서 발송 완료",
                "admin"
        );

        inquiryRepository.saveAll(List.of(inquiry1, inquiry2, inquiry3));
        log.info("[Bootstrap] Seeded 3 sample agency inquiries.");
    }

    private void seedSampleReservationsIfEmpty() {
        if (reservationSlotRepository.count() > 0) {
            return;
        }

        LocalDate today = LocalDate.now();
        List<LocalTime> dailyTimes = List.of(
                LocalTime.of(10, 0),
                LocalTime.of(11, 0),
                LocalTime.of(14, 0),
                LocalTime.of(15, 0),
                LocalTime.of(16, 0),
                LocalTime.of(17, 0)
        );

        ReservationSlot today11Slot = null;
        ReservationSlot today14Slot = null;

        for (int dayOffset = 0; dayOffset < 14; dayOffset++) {
            LocalDate targetDate = today.plusDays(dayOffset);
            for (LocalTime time : dailyTimes) {
                ReservationSlot slot = ReservationSlot.builder()
                        .slotDate(targetDate)
                        .slotTime(time)
                        .serviceName("1:1 홈페이지 제작·견적 맞춤 상담")
                        .maxCapacity(3)
                        .closed(false)
                        .build();
                ReservationSlot savedSlot = reservationSlotRepository.save(slot);
                if (dayOffset == 0 && time.equals(LocalTime.of(11, 0))) {
                    today11Slot = savedSlot;
                } else if (dayOffset == 0 && time.equals(LocalTime.of(14, 0))) {
                    today14Slot = savedSlot;
                }
            }
        }

        if (today11Slot != null) {
            today11Slot.reserve(1, false);
            reservationSlotRepository.save(today11Slot);

            Reservation confirmedRes = Reservation.builder()
                    .slot(today11Slot)
                    .customerName("(주)다온에프앤비 정민수 이사")
                    .customerPhone("010-3456-7890")
                    .customerEmail("ms.jung@daonfnb.co.kr")
                    .visitorCount(1)
                    .customFields("{\"industry\":\"기업·프랜차이즈\",\"preferredPlan\":\"DELUXE\",\"memo\":\"가맹점 모집 랜딩 및 본사 홈페이지 통합 구축 상담 희망\"}")
                    .clientIp("127.0.0.1")
                    .initialStatus(Reservation.ReservationStatus.CONFIRMED)
                    .build();
            confirmedRes.changeStatus(Reservation.ReservationStatus.CONFIRMED, "줌(Zoom) 화상 미팅 링크 발송 완료");
            reservationRepository.save(confirmedRes);
        }

        if (today14Slot != null) {
            today14Slot.reserve(1, false);
            reservationSlotRepository.save(today14Slot);

            Reservation requestedRes = Reservation.builder()
                    .slot(today14Slot)
                    .customerName("서울더바른정형외과 최지훈 행정부장")
                    .customerPhone("010-7788-9900")
                    .customerEmail("admin@seoul-ortho.kr")
                    .visitorCount(1)
                    .customFields("{\"industry\":\"병의원·클리닉\",\"preferredPlan\":\"PREMIUM\",\"memo\":\"도수치료 예약 및 원장님별 진료 시간표 연동 문의\"}")
                    .clientIp("127.0.0.1")
                    .initialStatus(Reservation.ReservationStatus.REQUESTED)
                    .build();
            reservationRepository.save(requestedRes);
        }

        log.info("[Bootstrap] Seeded 14 days of reservation slots and 2 sample reservations.");
    }
}

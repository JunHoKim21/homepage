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
import java.util.ArrayList;
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
            seedDefaultAdmin();
            seedSampleInquiries();
            seedReservationSlotsAndSampleBookings();
        });
    }

    private void seedDefaultAdmin() {
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
                    .fullName("시스템 관리자")
                    .email("admin@starterkit.local")
                    .totpEnabled(false)
                    .build();
            defaultAdmin.addRole(superAdminRole);
            adminRepository.save(defaultAdmin);
            log.info("[Bootstrap] Default super admin 'admin' initialized.");
        }
    }

    private void seedSampleInquiries() {
        if (inquiryRepository.count() > 0) {
            return;
        }

        Inquiry pending1 = Inquiry.builder()
                .category("ESTIMATE")
                .customerName("김서연 원장")
                .customerPhone("010-3412-8901")
                .customerEmail("sykim@brightclinic.kr")
                .title("피부과 신규 개원 홈페이지 및 예약 연동 견적 문의드립니다")
                .content("다음 달 강남역 인근 피부과 개원을 앞두고 있습니다. 기존 일반 임대형 웹빌더 대신 병원 자체 소유권이 보장되는 홈페이지로 구축하고 싶고, 네이버 예약과 1:1 상담 예약을 함께 연결하고 싶습니다. 스탠다드 패키지 기준 제작 기간과 견적 안내 부탁드립니다.")
                .customFields("{\"industry\":\"의료/병원\",\"budget\":\"250~350만원\",\"desiredPeriod\":\"3주 이내\"}")
                .privacyAgreed(true)
                .clientIp("127.0.0.1")
                .build();

        Inquiry pending2 = Inquiry.builder()
                .category("GENERAL")
                .customerName("박준호 대표")
                .customerPhone("010-7721-4509")
                .customerEmail("jhpark@hanbit-tech.co.kr")
                .title("소상공인 정부지원 바우처 활용 제작 가능 여부 문의")
                .content("제조업 B2B 기업입니다. 올해 정부지원 바우처 사업으로 회사 소개 및 제품 카탈로그 홈페이지를 새로 제작하려고 합니다. 표준 견적서와 과업지시서 발급이 가능한지, 그리고 거래처 도면 파일을 안전하게 첨부받을 수 있는지 궁금합니다.")
                .customFields("{\"industry\":\"제조/B2B\",\"budget\":\"400~500만원\",\"voucher\":\"혁신바우처\"}")
                .privacyAgreed(true)
                .clientIp("127.0.0.1")
                .build();

        Inquiry completed = Inquiry.builder()
                .category("ESTIMATE")
                .customerName("이수진 실장")
                .customerPhone("010-5509-1234")
                .customerEmail("sjlee@studioarc.kr")
                .title("인테리어 시공 사례 포트폴리오 리뉴얼 상담 요청")
                .content("일반 임대형 웹빌더로 운영 중인 기존 사이트가 시공 사진이 많아지면서 모바일 로딩이 너무 느려졌습니다. 사진 자동 최적화 기능과 실측 예약 기능이 포함된 리뉴얼 견적을 받고 싶습니다.")
                .customFields("{\"industry\":\"인테리어/건축\",\"budget\":\"280만원\",\"currentSite\":\"리뉴얼\"}")
                .privacyAgreed(true)
                .clientIp("127.0.0.1")
                .build();
        completed.updateStatusAndMemo(
                Inquiry.InquiryStatus.COMPLETED,
                "스탠다드 패키지(280만원) 및 WebP 자동 최적화 파이프라인 안내 완료. 다음 주 화요일 1차 시안 미팅 확정.",
                "admin"
        );

        inquiryRepository.saveAll(List.of(pending1, pending2, completed));
        log.info("[Bootstrap] Seeded 3 sample inquiries (2 PENDING, 1 COMPLETED).");
    }

    private void seedReservationSlotsAndSampleBookings() {
        if (reservationSlotRepository.count() > 0) {
            return;
        }

        LocalDate today = LocalDate.now();
        List<LocalTime> dailyTimes = List.of(
                LocalTime.of(19, 30),
                LocalTime.of(20, 30),
                LocalTime.of(21, 30)
        );
        String serviceName = "1:1 맞춤 홈페이지 상담";
        int slotCapacity = 3;

        List<ReservationSlot> slotsToSave = new ArrayList<>();
        for (int dayOffset = 0; dayOffset < 14; dayOffset++) {
            LocalDate slotDate = today.plusDays(dayOffset);
            for (LocalTime time : dailyTimes) {
                slotsToSave.add(ReservationSlot.builder()
                        .slotDate(slotDate)
                        .slotTime(time)
                        .serviceName(serviceName)
                        .maxCapacity(slotCapacity)
                        .closed(false)
                        .build());
            }
        }

        List<ReservationSlot> savedSlots = reservationSlotRepository.saveAll(slotsToSave);

        if (savedSlots.size() >= 2) {
            ReservationSlot slot1930 = savedSlots.get(0);
            ReservationSlot slot2030 = savedSlots.get(1);

            slot1930.reserve(1, false);
            slot2030.reserve(1, false);
            reservationSlotRepository.saveAll(List.of(slot1930, slot2030));

            Reservation sample1 = Reservation.builder()
                    .slot(slot1930)
                    .customerName("최유진 대표")
                    .customerPhone("010-2345-6789")
                    .customerEmail("yjchoi@momentwellness.kr")
                    .visitorCount(1)
                    .customFields("{\"industry\":\"뷰티/웰니스\",\"topic\":\"정원제 예약 시스템 도입 상담\"}")
                    .clientIp("127.0.0.1")
                    .initialStatus(Reservation.ReservationStatus.CONFIRMED)
                    .build();

            Reservation sample2 = Reservation.builder()
                    .slot(slot2030)
                    .customerName("정현우 변호사")
                    .customerPhone("010-8901-2345")
                    .customerEmail("hwjung@lawjungyul.kr")
                    .visitorCount(1)
                    .customFields("{\"industry\":\"법률/세무\",\"topic\":\"기존 사이트 이전 및 SEO 세팅 문의\"}")
                    .clientIp("127.0.0.1")
                    .initialStatus(Reservation.ReservationStatus.REQUESTED)
                    .build();

            reservationRepository.saveAll(List.of(sample1, sample2));
            log.info("[Bootstrap] Seeded 42 reservation slots (14 days x 3 evening slots, capacity 3) and 2 sample bookings for today.");
        }
    }
}

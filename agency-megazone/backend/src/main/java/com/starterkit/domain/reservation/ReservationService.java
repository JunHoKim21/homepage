package com.starterkit.domain.reservation;

import com.starterkit.common.exception.BusinessException;
import com.starterkit.common.exception.ErrorCode;
import com.starterkit.domain.cms.SiteConfigService;
import com.starterkit.domain.inquiry.InquiryService;
import com.starterkit.domain.inquiry.OutboxEvent;
import com.starterkit.domain.inquiry.OutboxEventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.OffsetDateTime;
import java.time.YearMonth;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ReservationService {

    private final ReservationSlotRepository slotRepository;
    private final ReservationRepository reservationRepository;
    private final SiteConfigService siteConfigService;
    private final OutboxEventRepository outboxEventRepository;
    private final ApplicationEventPublisher eventPublisher;

    public record ReservationPolicyResult(
            String reservationMode,         // OFF | NAVER | INTERNAL | BOTH
            String reservationCapacityMode, // SINGLE | MULTI
            int defaultCapacity,
            String naverBookingUrl,
            boolean autoConfirm
    ) {}

    public record SlotViewResult(
            Long slotId,
            LocalDate slotDate,
            LocalTime slotTime,
            String serviceName,
            boolean available,
            Integer maxCapacity,       // SINGLE 모드일 경우 null (UI에서 잔여석 숫자 미표시)
            Integer remainingCapacity  // SINGLE 모드일 경우 null (UI에서 마감 여부만 표시)
    ) {}

    public record AdminSlotItemResult(
            Long slotId,
            LocalDate slotDate,
            LocalTime slotTime,
            String serviceName,
            int maxCapacity,
            int reservedCount,
            boolean closed
    ) {}

    public record BatchCreateSlotsCommand(
            LocalDate startDate,
            LocalDate endDate,
            Set<DayOfWeek> daysOfWeek,
            List<LocalTime> times,
            String serviceName,
            int maxCapacity
    ) {}

    public record BatchCreateSlotsResult(
            int createdCount,
            int skippedCount
    ) {}

    public record CreateReservationCommand(
            Long slotId,
            Long memberId,
            String customerName,
            String customerPhone,
            String customerEmail,
            int visitorCount,
            String customFieldsJson,
            Long orderId,
            String clientIp
    ) {}

    public record ReservationDetailResult(
            Long id,
            UUID publicId,
            Long slotId,
            LocalDate slotDate,
            LocalTime slotTime,
            String serviceName,
            String customerName,
            String customerPhone,
            String customerEmail,
            int visitorCount,
            String customFieldsJson,
            String status,
            Long orderId,
            String adminMemo,
            OffsetDateTime createdAt
    ) {}

    @Transactional(readOnly = true)
    public ReservationPolicyResult getCurrentReservationPolicy() {
        Map<String, String> configs = siteConfigService.getPublicConfigsMap();
        String mode = configs.getOrDefault("reservation_mode", "BOTH");
        String capMode = configs.getOrDefault("reservation_capacity_mode", "SINGLE");
        int defaultCap = parsePositiveInt(configs.getOrDefault("reservation_default_capacity", "1"), 1);
        String naverUrl = configs.getOrDefault("naver_booking_url", "https://booking.naver.com/");
        boolean autoConfirm = "true".equalsIgnoreCase(configs.getOrDefault("reservation_auto_confirm", "false"));
        return new ReservationPolicyResult(mode, capMode, defaultCap, naverUrl, autoConfirm);
    }

    /**
     * 날짜별 슬롯 조회:
     * - SINGLE 모드: 잔여석 숫자를 숨기고(null) 마감 여부(available)만 반환
     * - MULTI 모드: maxCapacity 및 remainingCapacity를 함께 반환
     */
    @Transactional(readOnly = true)
    public List<SlotViewResult> getSlotsByDate(LocalDate date) {
        ReservationPolicyResult policy = getCurrentReservationPolicy();
        validateInternalBookingEnabled(policy.reservationMode());
        boolean singleMode = "SINGLE".equalsIgnoreCase(policy.reservationCapacityMode());

        return slotRepository.findBySlotDateOrderBySlotTimeAsc(date)
                .stream()
                .map(slot -> {
                    boolean available = slot.isAvailable(singleMode);
                    Integer maxCap = singleMode ? null : slot.getMaxCapacity();
                    Integer remCap = singleMode ? null : Math.max(0, slot.getMaxCapacity() - slot.getReservedCount());
                    return new SlotViewResult(
                            slot.getId(),
                            slot.getSlotDate(),
                            slot.getSlotTime(),
                            slot.getServiceName(),
                            available,
                            maxCap,
                            remCap
                    );
                })
                .toList();
    }

    /**
     * 자체 예약 접수:
     * SELECT ... FOR UPDATE (PESSIMISTIC_WRITE) 행 잠금을 통해 동시 클릭 시에도 초과 예약(Overbooking)을 100% 방어합니다.
     */
    @Transactional
    public ReservationDetailResult createReservation(CreateReservationCommand cmd) {
        ReservationPolicyResult policy = getCurrentReservationPolicy();
        validateInternalBookingEnabled(policy.reservationMode());
        boolean singleMode = "SINGLE".equalsIgnoreCase(policy.reservationCapacityMode());

        ReservationSlot slot = slotRepository.findByIdForUpdate(cmd.slotId())
                .orElseThrow(() -> new BusinessException(ErrorCode.RESOURCE_NOT_FOUND, "선택하신 예약 시간대 슬롯이 존재하지 않습니다."));

        int effectiveVisitorCount = singleMode ? 1 : Math.max(1, cmd.visitorCount());
        slot.reserve(effectiveVisitorCount, singleMode);

        Reservation.ReservationStatus initialStatus = policy.autoConfirm()
                ? Reservation.ReservationStatus.CONFIRMED
                : Reservation.ReservationStatus.REQUESTED;

        Reservation reservation = Reservation.builder()
                .slot(slot)
                .memberId(cmd.memberId())
                .customerName(cmd.customerName().trim())
                .customerPhone(cmd.customerPhone().trim())
                .customerEmail(cmd.customerEmail())
                .visitorCount(effectiveVisitorCount)
                .customFields(cmd.customFieldsJson())
                .orderId(cmd.orderId())
                .clientIp(cmd.clientIp())
                .initialStatus(initialStatus)
                .build();

        Reservation saved = reservationRepository.save(reservation);

        String payload = String.format(
                "{\"publicId\":\"%s\",\"slotDate\":\"%s\",\"slotTime\":\"%s\",\"customerName\":\"%s\",\"visitorCount\":%d}",
                saved.getPublicId(),
                slot.getSlotDate(),
                slot.getSlotTime(),
                saved.getCustomerName(),
                saved.getVisitorCount()
        );
        OutboxEvent outbox = outboxEventRepository.save(OutboxEvent.builder()
                .aggregateType("RESERVATION")
                .aggregateId(saved.getPublicId().toString())
                .eventType("SEND_RESERVATION_ALIMTALK")
                .payload(payload)
                .build());
        eventPublisher.publishEvent(new InquiryService.OutboxCommittedEvent(outbox.getId()));

        return toDetailResult(saved, slot);
    }

    @Transactional
    public SlotViewResult createOrUpdateSlotByAdmin(LocalDate slotDate, LocalTime slotTime,
                                                    String serviceName, int maxCapacity, boolean closed) {
        ReservationPolicyResult policy = getCurrentReservationPolicy();
        boolean singleMode = "SINGLE".equalsIgnoreCase(policy.reservationCapacityMode());
        int finalCapacity = singleMode ? 1 : Math.max(1, maxCapacity);

        ReservationSlot slot = slotRepository.save(ReservationSlot.builder()
                .slotDate(slotDate)
                .slotTime(slotTime)
                .serviceName(serviceName)
                .maxCapacity(finalCapacity)
                .closed(closed)
                .build());

        return new SlotViewResult(
                slot.getId(),
                slot.getSlotDate(),
                slot.getSlotTime(),
                slot.getServiceName(),
                slot.isAvailable(singleMode),
                singleMode ? null : slot.getMaxCapacity(),
                singleMode ? null : Math.max(0, slot.getMaxCapacity() - slot.getReservedCount())
        );
    }

    @Transactional(readOnly = true)
    public List<AdminSlotItemResult> getMonthlySlotsForAdmin(int year, int month) {
        YearMonth ym = YearMonth.of(year, month);
        return slotRepository.findBySlotDateBetweenOrderBySlotDateAscSlotTimeAsc(ym.atDay(1), ym.atEndOfMonth())
                .stream()
                .map(this::toAdminSlotItem)
                .toList();
    }

    @Transactional
    public BatchCreateSlotsResult createBatchSlotsByAdmin(BatchCreateSlotsCommand cmd) {
        if (cmd.startDate() == null || cmd.endDate() == null || cmd.endDate().isBefore(cmd.startDate())) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "시작일과 종료일 범위가 올바르지 않습니다.");
        }
        if (cmd.times() == null || cmd.times().isEmpty()) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "최소 1개 이상의 시간대를 선택해 주세요.");
        }

        ReservationPolicyResult policy = getCurrentReservationPolicy();
        boolean singleMode = "SINGLE".equalsIgnoreCase(policy.reservationCapacityMode());
        int finalCapacity = singleMode ? 1 : Math.max(1, cmd.maxCapacity());
        String svcName = cmd.serviceName() != null && !cmd.serviceName().isBlank() ? cmd.serviceName().trim() : "DEFAULT";

        int created = 0;
        int skipped = 0;
        for (LocalDate date = cmd.startDate(); !date.isAfter(cmd.endDate()); date = date.plusDays(1)) {
            if (cmd.daysOfWeek() != null && !cmd.daysOfWeek().isEmpty() && !cmd.daysOfWeek().contains(date.getDayOfWeek())) {
                continue;
            }
            for (LocalTime time : cmd.times()) {
                if (slotRepository.existsBySlotDateAndSlotTimeAndServiceName(date, time, svcName)) {
                    skipped++;
                    continue;
                }
                slotRepository.save(ReservationSlot.builder()
                        .slotDate(date)
                        .slotTime(time)
                        .serviceName(svcName)
                        .maxCapacity(finalCapacity)
                        .closed(false)
                        .build());
                created++;
            }
        }
        return new BatchCreateSlotsResult(created, skipped);
    }

    @Transactional
    public AdminSlotItemResult toggleSlotClosedByAdmin(Long slotId) {
        ReservationSlot slot = slotRepository.findById(slotId)
                .orElseThrow(() -> new BusinessException(ErrorCode.RESOURCE_NOT_FOUND));
        slot.toggleClosed();
        return toAdminSlotItem(slot);
    }

    @Transactional
    public void deleteSlotByAdmin(Long slotId) {
        ReservationSlot slot = slotRepository.findById(slotId)
                .orElseThrow(() -> new BusinessException(ErrorCode.RESOURCE_NOT_FOUND));
        if (slot.getReservedCount() > 0) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "이미 예약이 접수된 슬롯은 삭제할 수 없습니다. 마감 처리해 주세요.");
        }
        slotRepository.delete(slot);
    }

    private AdminSlotItemResult toAdminSlotItem(ReservationSlot s) {
        return new AdminSlotItemResult(
                s.getId(),
                s.getSlotDate(),
                s.getSlotTime(),
                s.getServiceName(),
                s.getMaxCapacity(),
                s.getReservedCount(),
                s.isClosed()
        );
    }

    @Transactional(readOnly = true)
    public List<ReservationDetailResult> listAllReservationsForAdmin() {
        return reservationRepository.findAllWithSlotOrderByCreatedAtDesc()
                .stream()
                .map(r -> toDetailResult(r, r.getSlot()))
                .toList();
    }

    @Transactional
    public ReservationDetailResult changeReservationStatusByAdmin(Long reservationId,
                                                                  Reservation.ReservationStatus nextStatus,
                                                                  String adminMemo) {
        Reservation reservation = reservationRepository.findByIdWithSlot(reservationId)
                .orElseThrow(() -> new BusinessException(ErrorCode.RESOURCE_NOT_FOUND));

        ReservationSlot lockedSlot = slotRepository.findByIdForUpdate(reservation.getSlot().getId())
                .orElseThrow(() -> new BusinessException(ErrorCode.RESOURCE_NOT_FOUND));

        boolean releaseNeeded = reservation.changeStatus(nextStatus, adminMemo);
        if (releaseNeeded) {
            lockedSlot.release(reservation.getVisitorCount());
        }

        return toDetailResult(reservation, lockedSlot);
    }

    private void validateInternalBookingEnabled(String reservationMode) {
        if ("OFF".equalsIgnoreCase(reservationMode) || "NAVER".equalsIgnoreCase(reservationMode)) {
            throw new BusinessException(
                    ErrorCode.FEATURE_DISABLED,
                    "현재 자체 예약 기능이 비활성화되어 있습니다 (현재 모드: " + reservationMode + ")."
            );
        }
    }

    private int parsePositiveInt(String val, int fallback) {
        try {
            return Math.max(1, Integer.parseInt(val.trim()));
        } catch (Exception e) {
            return fallback;
        }
    }

    private ReservationDetailResult toDetailResult(Reservation r, ReservationSlot s) {
        return new ReservationDetailResult(
                r.getId(),
                r.getPublicId(),
                s.getId(),
                s.getSlotDate(),
                s.getSlotTime(),
                s.getServiceName(),
                r.getCustomerName(),
                r.getCustomerPhone(),
                r.getCustomerEmail(),
                r.getVisitorCount(),
                r.getCustomFields(),
                r.getStatus().name(),
                r.getOrderId(),
                r.getAdminMemo(),
                r.getCreatedAt()
        );
    }
}

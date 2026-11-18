package com.starterkit.api.adminapi;

import com.starterkit.common.response.ApiResponse;
import com.starterkit.common.security.AuthenticatedPrincipal;
import com.starterkit.domain.inquiry.Inquiry;
import com.starterkit.domain.inquiry.InquiryService;
import com.starterkit.domain.reservation.Reservation;
import com.starterkit.domain.reservation.ReservationService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminInquiryAndReservationController {

    private final InquiryService inquiryService;
    private final ReservationService reservationService;

    public record UpdateInquiryPayload(
            @NotNull Inquiry.InquiryStatus status,
            String adminMemo
    ) {}

    public record CreateSlotPayload(
            @NotNull LocalDate slotDate,
            @NotNull LocalTime slotTime,
            String serviceName,
            @Min(1) int maxCapacity,
            boolean closed
    ) {}

    public record BatchCreateSlotsPayload(
            @NotNull LocalDate startDate,
            @NotNull LocalDate endDate,
            Set<DayOfWeek> daysOfWeek,
            @NotNull List<LocalTime> times,
            String serviceName,
            @Min(1) int maxCapacity
    ) {}

    public record UpdateReservationStatusPayload(
            @NotNull Reservation.ReservationStatus status,
            String adminMemo
    ) {}

    @GetMapping("/inquiries")
    public ApiResponse<List<InquiryService.InquiryDetailResult>> listInquiries(
            @RequestParam(required = false) Inquiry.InquiryStatus status) {
        return ApiResponse.ok(inquiryService.listInquiriesForAdmin(status));
    }

    @PatchMapping("/inquiries/{inquiryId}")
    public ApiResponse<InquiryService.InquiryDetailResult> updateInquiry(
            @PathVariable Long inquiryId,
            @Valid @RequestBody UpdateInquiryPayload p,
            @AuthenticationPrincipal AuthenticatedPrincipal principal) {
        String actor = principal != null ? principal.identifier() : "ADMIN";
        return ApiResponse.ok(inquiryService.updateInquiryByAdmin(inquiryId, p.status(), p.adminMemo(), actor));
    }

    @GetMapping("/reservations")
    public ApiResponse<List<ReservationService.ReservationDetailResult>> listReservations() {
        return ApiResponse.ok(reservationService.listAllReservationsForAdmin());
    }

    @GetMapping("/reservations/slots")
    public ApiResponse<List<ReservationService.AdminSlotItemResult>> listMonthlySlots(
            @RequestParam int year,
            @RequestParam int month) {
        return ApiResponse.ok(reservationService.getMonthlySlotsForAdmin(year, month));
    }

    @PostMapping("/reservations/slots")
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<ReservationService.SlotViewResult> createSlot(@Valid @RequestBody CreateSlotPayload p) {
        return ApiResponse.ok(reservationService.createOrUpdateSlotByAdmin(
                p.slotDate(), p.slotTime(), p.serviceName(), p.maxCapacity(), p.closed()
        ));
    }

    @PostMapping("/reservations/slots/batch")
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<ReservationService.BatchCreateSlotsResult> createBatchSlots(
            @Valid @RequestBody BatchCreateSlotsPayload p) {
        return ApiResponse.ok(reservationService.createBatchSlotsByAdmin(
                new ReservationService.BatchCreateSlotsCommand(
                        p.startDate(), p.endDate(), p.daysOfWeek(), p.times(), p.serviceName(), p.maxCapacity()
                )
        ));
    }

    @PatchMapping("/reservations/slots/{slotId}/toggle")
    public ApiResponse<ReservationService.AdminSlotItemResult> toggleSlotClosed(@PathVariable Long slotId) {
        return ApiResponse.ok(reservationService.toggleSlotClosedByAdmin(slotId));
    }

    @DeleteMapping("/reservations/slots/{slotId}")
    public ApiResponse<Void> deleteSlot(@PathVariable Long slotId) {
        reservationService.deleteSlotByAdmin(slotId);
        return ApiResponse.ok();
    }

    @PatchMapping("/reservations/{reservationId}/status")
    public ApiResponse<ReservationService.ReservationDetailResult> updateReservationStatus(
            @PathVariable Long reservationId,
            @Valid @RequestBody UpdateReservationStatusPayload p) {
        return ApiResponse.ok(reservationService.changeReservationStatusByAdmin(
                reservationId, p.status(), p.adminMemo()
        ));
    }
}

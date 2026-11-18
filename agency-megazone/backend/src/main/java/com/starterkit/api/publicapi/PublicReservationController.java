package com.starterkit.api.publicapi;

import com.starterkit.common.response.ApiResponse;
import com.starterkit.common.security.AuthenticatedPrincipal;
import com.starterkit.domain.reservation.ReservationService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/v1/reservations")
@RequiredArgsConstructor
public class PublicReservationController {

    private final ReservationService reservationService;

    public record CreateReservationPayload(
            @NotNull Long slotId,
            @NotBlank String customerName,
            @NotBlank String customerPhone,
            String customerEmail,
            @Min(1) int visitorCount,
            String customFieldsJson,
            Long orderId
    ) {}

    @GetMapping("/policy")
    public ApiResponse<ReservationService.ReservationPolicyResult> getReservationPolicy() {
        return ApiResponse.ok(reservationService.getCurrentReservationPolicy());
    }

    @GetMapping("/slots")
    public ApiResponse<List<ReservationService.SlotViewResult>> listSlotsByDate(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ApiResponse.ok(reservationService.getSlotsByDate(date));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<ReservationService.ReservationDetailResult> createReservation(
            @Valid @RequestBody CreateReservationPayload p,
            @AuthenticationPrincipal AuthenticatedPrincipal principal,
            HttpServletRequest request) {
        Long memberId = (principal != null && !principal.isAdmin()) ? principal.subjectId() : null;
        return ApiResponse.ok(reservationService.createReservation(new ReservationService.CreateReservationCommand(
                p.slotId(),
                memberId,
                p.customerName(),
                p.customerPhone(),
                p.customerEmail(),
                p.visitorCount(),
                p.customFieldsJson(),
                p.orderId(),
                request.getRemoteAddr()
        )));
    }
}

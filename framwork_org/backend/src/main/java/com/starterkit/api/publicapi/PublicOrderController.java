package com.starterkit.api.publicapi;

import com.starterkit.common.response.ApiResponse;
import com.starterkit.common.security.AuthenticatedPrincipal;
import com.starterkit.domain.order.OrderService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/orders")
@RequiredArgsConstructor
public class PublicOrderController {

    private final OrderService orderService;

    public record CreateOrderPayload(
            @NotBlank String orderName,
            @NotNull @DecimalMin("1.00") BigDecimal totalAmount,
            @NotBlank String idempotencyKey,
            String pgProvider
    ) {}

    public record ConfirmOrderPayload(
            @NotBlank String paymentKey
    ) {}

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<OrderService.OrderResult> createOrder(
            @Valid @RequestBody CreateOrderPayload p,
            @AuthenticationPrincipal AuthenticatedPrincipal principal) {
        Long memberId = (principal != null && !principal.isAdmin()) ? principal.subjectId() : null;
        return ApiResponse.ok(orderService.createOrder(new OrderService.CreateOrderCommand(
                memberId,
                p.orderName(),
                p.totalAmount(),
                p.idempotencyKey(),
                p.pgProvider()
        )));
    }

    @PostMapping("/{orderPublicId}/confirm")
    public ApiResponse<OrderService.OrderResult> confirmOrder(
            @PathVariable UUID orderPublicId,
            @Valid @RequestBody ConfirmOrderPayload p) {
        return ApiResponse.ok(orderService.confirmOrderPayment(orderPublicId, p.paymentKey()));
    }
}

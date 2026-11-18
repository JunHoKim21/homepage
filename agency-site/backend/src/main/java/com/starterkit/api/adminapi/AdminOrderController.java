package com.starterkit.api.adminapi;

import com.starterkit.common.response.ApiResponse;
import com.starterkit.domain.order.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin/orders")
@RequiredArgsConstructor
public class AdminOrderController {

    private final OrderService orderService;

    public record CancelOrderPayload(String reason) {}

    @GetMapping
    public ApiResponse<List<OrderService.OrderResult>> listOrders() {
        return ApiResponse.ok(orderService.listAllOrdersForAdmin());
    }

    @PostMapping("/{orderPublicId}/cancel")
    public ApiResponse<OrderService.OrderResult> cancelOrRefundOrder(
            @PathVariable UUID orderPublicId,
            @RequestBody(required = false) CancelOrderPayload p) {
        String reason = p != null ? p.reason() : "관리자 취소/환불";
        return ApiResponse.ok(orderService.cancelOrRefundByAdmin(orderPublicId, reason));
    }
}

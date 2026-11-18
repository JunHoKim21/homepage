package com.starterkit.api.publicapi;

import com.starterkit.common.response.ApiResponse;
import com.starterkit.infra.config.StarterProperties;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/health")
@RequiredArgsConstructor
public class HealthController {

    private final StarterProperties starterProperties;

    @GetMapping
    public ApiResponse<Map<String, Object>> health() {
        return ApiResponse.ok(Map.of(
                "status", "UP",
                "version", "2.0.0-FINAL",
                "reservationMode", starterProperties.features().reservationMode().name(),
                "reservationCapacityMode", starterProperties.features().reservationCapacityMode().name()
        ));
    }
}

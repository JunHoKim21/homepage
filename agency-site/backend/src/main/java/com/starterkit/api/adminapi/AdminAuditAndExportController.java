package com.starterkit.api.adminapi;

import com.starterkit.common.response.ApiResponse;
import com.starterkit.domain.audit.AuditLogService;
import com.starterkit.infra.excel.ExcelExportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminAuditAndExportController {

    private static final MediaType XLSX_MEDIA_TYPE = MediaType.parseMediaType(
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    private final AuditLogService auditLogService;
    private final ExcelExportService excelExportService;

    @GetMapping("/audit-logs")
    public ApiResponse<List<AuditLogService.AuditLogItemResult>> listRecentAuditLogs() {
        return ApiResponse.ok(auditLogService.listRecentLogs());
    }

    @GetMapping("/export/inquiries")
    public ResponseEntity<byte[]> exportInquiriesXlsx() {
        byte[] bytes = excelExportService.exportInquiriesToXlsx();
        return buildXlsxResponse("inquiries_" + LocalDate.now() + ".xlsx", bytes);
    }

    @GetMapping("/export/reservations")
    public ResponseEntity<byte[]> exportReservationsXlsx() {
        byte[] bytes = excelExportService.exportReservationsToXlsx();
        return buildXlsxResponse("reservations_" + LocalDate.now() + ".xlsx", bytes);
    }

    private ResponseEntity<byte[]> buildXlsxResponse(String filename, byte[] bytes) {
        ContentDisposition disposition = ContentDisposition.attachment()
                .filename(filename, StandardCharsets.UTF_8)
                .build();
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, disposition.toString())
                .header(HttpHeaders.CACHE_CONTROL, "no-store")
                .contentLength(bytes.length)
                .contentType(XLSX_MEDIA_TYPE)
                .body(bytes);
    }
}

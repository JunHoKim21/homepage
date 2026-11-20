package com.starterkit.infra.excel;

import com.starterkit.common.config.FeatureSwitch;
import com.starterkit.common.exception.BusinessException;
import com.starterkit.common.exception.ErrorCode;
import com.starterkit.domain.audit.AuditLog;
import com.starterkit.domain.inquiry.InquiryService;
import com.starterkit.domain.reservation.ReservationService;
import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.xssf.streaming.SXSSFWorkbook;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;

/**
 * 768MB 저메모리 컨테이너 생존을 위한 Apache POI SXSSF 스트리밍 엑셀 생성기.
 * 메모리에 최근 100행만 유지하고 나머지는 디스크로 플러시하여 대량 추출 시에도 OOM을 방지합니다.
 */
@Service
@RequiredArgsConstructor
public class ExcelExportService {

    private static final int STREAMING_WINDOW_SIZE = 100;

    private final InquiryService inquiryService;
    private final ReservationService reservationService;
    private final FeatureSwitch featureSwitch;

    @AuditLog(actionType = "EXPORT", domainType = "INQUIRY")
    public byte[] exportInquiriesToXlsx() {
        ensureExportEnabled();
        List<InquiryService.InquiryDetailResult> rows = inquiryService.listInquiriesForAdmin(null);

        try (SXSSFWorkbook workbook = new SXSSFWorkbook(STREAMING_WINDOW_SIZE);
             ByteArrayOutputStream out = new ByteArrayOutputStream()) {

            Sheet sheet = workbook.createSheet("상담문의목록");
            Row header = sheet.createRow(0);
            String[] cols = {"ID", "카테고리", "고객명", "연락처", "이메일", "제목", "상태", "접수IP", "접수일시"};
            for (int i = 0; i < cols.length; i++) {
                header.createCell(i).setCellValue(cols[i]);
            }

            int rowIdx = 1;
            for (InquiryService.InquiryDetailResult item : rows) {
                Row row = sheet.createRow(rowIdx++);
                row.createCell(0).setCellValue(item.id());
                row.createCell(1).setCellValue(nullSafe(item.category()));
                row.createCell(2).setCellValue(nullSafe(item.customerName()));
                row.createCell(3).setCellValue(nullSafe(item.customerPhone()));
                row.createCell(4).setCellValue(nullSafe(item.customerEmail()));
                row.createCell(5).setCellValue(nullSafe(item.title()));
                row.createCell(6).setCellValue(nullSafe(item.status()));
                row.createCell(7).setCellValue(nullSafe(item.clientIp()));
                row.createCell(8).setCellValue(item.createdAt() != null ? item.createdAt().toString() : "");
            }

            workbook.write(out);
            workbook.dispose();
            return out.toByteArray();
        } catch (IOException e) {
            throw new BusinessException(ErrorCode.INTERNAL_ERROR, "엑셀 파일 생성 중 오류가 발생했습니다.");
        }
    }

    @AuditLog(actionType = "EXPORT", domainType = "RESERVATION")
    public byte[] exportReservationsToXlsx() {
        ensureExportEnabled();
        List<ReservationService.ReservationDetailResult> rows = reservationService.listAllReservationsForAdmin();

        try (SXSSFWorkbook workbook = new SXSSFWorkbook(STREAMING_WINDOW_SIZE);
             ByteArrayOutputStream out = new ByteArrayOutputStream()) {

            Sheet sheet = workbook.createSheet("예약목록");
            Row header = sheet.createRow(0);
            String[] cols = {"ID", "예약일자", "예약시간", "서비스명", "고객명", "연락처", "인원수", "상태", "접수일시"};
            for (int i = 0; i < cols.length; i++) {
                header.createCell(i).setCellValue(cols[i]);
            }

            int rowIdx = 1;
            for (ReservationService.ReservationDetailResult item : rows) {
                Row row = sheet.createRow(rowIdx++);
                row.createCell(0).setCellValue(item.id());
                row.createCell(1).setCellValue(item.slotDate() != null ? item.slotDate().toString() : "");
                row.createCell(2).setCellValue(item.slotTime() != null ? item.slotTime().toString() : "");
                row.createCell(3).setCellValue(nullSafe(item.serviceName()));
                row.createCell(4).setCellValue(nullSafe(item.customerName()));
                row.createCell(5).setCellValue(nullSafe(item.customerPhone()));
                row.createCell(6).setCellValue(item.visitorCount());
                row.createCell(7).setCellValue(nullSafe(item.status()));
                row.createCell(8).setCellValue(item.createdAt() != null ? item.createdAt().toString() : "");
            }

            workbook.write(out);
            workbook.dispose();
            return out.toByteArray();
        } catch (IOException e) {
            throw new BusinessException(ErrorCode.INTERNAL_ERROR, "엑셀 파일 생성 중 오류가 발생했습니다.");
        }
    }

    private void ensureExportEnabled() {
        if (!featureSwitch.isExcelExportEnabled()) {
            throw new BusinessException(ErrorCode.FEATURE_DISABLED, "엑셀 다운로드 기능이 비활성화되어 있습니다.");
        }
    }

    private String nullSafe(String s) {
        return s != null ? s : "";
    }
}

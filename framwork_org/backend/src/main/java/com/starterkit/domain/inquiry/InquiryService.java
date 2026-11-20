package com.starterkit.domain.inquiry;

import com.starterkit.common.exception.BusinessException;
import com.starterkit.common.exception.ErrorCode;
import com.starterkit.common.util.UuidV7Generator;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class InquiryService {

    private final InquiryRepository inquiryRepository;
    private final OutboxEventRepository outboxEventRepository;
    private final ApplicationEventPublisher eventPublisher;
    private final NotificationPort notificationPort;

    public record SubmitInquiryCommand(
            String category,
            String customerName,
            String customerPhone,
            String customerEmail,
            String title,
            String content,
            String customFieldsJson,
            Long attachmentMediaId,
            boolean privacyAgreed,
            String websiteUrl, // Honeypot 숨김 필드
            String clientIp
    ) {}

    public record InquiryDetailResult(
            Long id,
            UUID publicId,
            String category,
            String customerName,
            String customerPhone,
            String customerEmail,
            String title,
            String content,
            String customFieldsJson,
            Long attachmentMediaId,
            String status,
            String adminMemo,
            String clientIp,
            String answeredBy,
            OffsetDateTime answeredAt,
            OffsetDateTime createdAt
    ) {}

    public record OutboxCommittedEvent(Long outboxEventId) {}

    /**
     * 상담 문의 접수:
     * 1. Honeypot(websiteUrl)에 값이 채워진 경우: 자동화 스팸 봇으로 판정하고 DB 저장/알림 발송 0건으로 가짜 성공 반환
     * 2. 정상 문의: inquiries + outbox_events 원자적 저장 후 AFTER_COMMIT 비동기 알림 트리거
     */
    @Transactional
    public InquiryDetailResult submitInquiry(SubmitInquiryCommand cmd) {
        if (!cmd.privacyAgreed()) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "개인정보 수집 및 이용에 동의해 주세요.");
        }

        // 1. Honeypot 검증 (스팸 봇일 경우 알림톡 충전금 보호를 위해 즉시 Fake Success 반환)
        if (cmd.websiteUrl() != null && !cmd.websiteUrl().isBlank()) {
            log.warn("[AntiSpam Honeypot] Blocked spam bot from IP={}, websiteUrl={}", cmd.clientIp(), cmd.websiteUrl());
            return new InquiryDetailResult(
                    0L,
                    UuidV7Generator.generate(),
                    cmd.category() != null ? cmd.category() : "GENERAL",
                    cmd.customerName(),
                    cmd.customerPhone(),
                    cmd.customerEmail(),
                    cmd.title(),
                    cmd.content(),
                    "{}",
                    null,
                    Inquiry.InquiryStatus.PENDING.name(),
                    null,
                    cmd.clientIp(),
                    null,
                    null,
                    OffsetDateTime.now()
            );
        }

        Inquiry inquiry = Inquiry.builder()
                .category(cmd.category())
                .customerName(cmd.customerName().trim())
                .customerPhone(cmd.customerPhone().trim())
                .customerEmail(cmd.customerEmail())
                .title(cmd.title().trim())
                .content(cmd.content())
                .customFields(cmd.customFieldsJson())
                .attachmentMediaId(cmd.attachmentMediaId())
                .privacyAgreed(true)
                .clientIp(cmd.clientIp())
                .build();

        Inquiry saved = inquiryRepository.save(inquiry);

        String payload = String.format(
                "{\"publicId\":\"%s\",\"customerName\":\"%s\",\"customerPhone\":\"%s\",\"title\":\"%s\"}",
                saved.getPublicId(),
                escapeJson(saved.getCustomerName()),
                escapeJson(saved.getCustomerPhone()),
                escapeJson(saved.getTitle())
        );

        OutboxEvent outbox = outboxEventRepository.save(OutboxEvent.builder()
                .aggregateType("INQUIRY")
                .aggregateId(saved.getPublicId().toString())
                .eventType("SEND_MULTI_NOTIFICATION")
                .payload(payload)
                .build());

        eventPublisher.publishEvent(new OutboxCommittedEvent(outbox.getId()));
        return toResult(saved);
    }

    @Transactional(readOnly = true)
    public List<InquiryDetailResult> listInquiriesForAdmin(Inquiry.InquiryStatus status) {
        List<Inquiry> list = status != null
                ? inquiryRepository.findByStatusAndDeletedAtIsNullOrderByCreatedAtDesc(status)
                : inquiryRepository.findByDeletedAtIsNullOrderByCreatedAtDesc();
        return list.stream().map(this::toResult).toList();
    }

    @Transactional
    public InquiryDetailResult updateInquiryByAdmin(Long id, Inquiry.InquiryStatus status, String adminMemo, String actor) {
        Inquiry inquiry = inquiryRepository.findByIdAndDeletedAtIsNull(id)
                .orElseThrow(() -> new BusinessException(ErrorCode.RESOURCE_NOT_FOUND));
        inquiry.updateStatusAndMemo(status, adminMemo, actor);
        return toResult(inquiry);
    }

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void onOutboxCommitted(OutboxCommittedEvent event) {
        notificationPort.dispatchOutboxAsync(event.outboxEventId());
    }

    private String escapeJson(String value) {
        if (value == null) {
            return "";
        }
        return value.replace("\\", "\\\\").replace("\"", "\\\"");
    }

    private InquiryDetailResult toResult(Inquiry i) {
        return new InquiryDetailResult(
                i.getId(),
                i.getPublicId(),
                i.getCategory(),
                i.getCustomerName(),
                i.getCustomerPhone(),
                i.getCustomerEmail(),
                i.getTitle(),
                i.getContent(),
                i.getCustomFields(),
                i.getAttachmentMediaId(),
                i.getStatus().name(),
                i.getAdminMemo(),
                i.getClientIp(),
                i.getAnsweredBy(),
                i.getAnsweredAt(),
                i.getCreatedAt()
        );
    }
}

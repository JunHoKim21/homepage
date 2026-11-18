package com.starterkit.infra.notification;

import com.starterkit.domain.inquiry.NotificationPort;
import com.starterkit.domain.inquiry.OutboxEvent;
import com.starterkit.domain.inquiry.OutboxEventRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.support.TransactionTemplate;

import java.time.OffsetDateTime;
import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class MultiChannelNotificationAdapter implements NotificationPort {

    private final OutboxEventRepository outboxEventRepository;
    private final TransactionTemplate transactionTemplate;

    @Async
    @Override
    public void dispatchOutboxAsync(Long outboxEventId) {
        processSingleEvent(outboxEventId);
    }

    @Scheduled(fixedDelay = 30000L)
    public void pollPendingOutboxEvents() {
        List<OutboxEvent> pendingList = outboxEventRepository
                .findTop50ByStatusAndNextRetryAtLessThanEqualOrderByCreatedAtAsc(
                        OutboxEvent.OutboxStatus.PENDING, OffsetDateTime.now());
        for (OutboxEvent event : pendingList) {
            processSingleEvent(event.getId());
        }
    }

    private void processSingleEvent(Long outboxEventId) {
        transactionTemplate.executeWithoutResult(status ->
                outboxEventRepository.findById(outboxEventId).ifPresent(event -> {
                    if (event.getStatus() != OutboxEvent.OutboxStatus.PENDING) {
                        return;
                    }
                    try {
                        log.info("[Notification Dispatched] type={}, aggregate={}, id={}, payload={}",
                                event.getEventType(), event.getAggregateType(), event.getAggregateId(), event.getPayload());
                        event.markPublished();
                    } catch (Exception e) {
                        log.warn("[Notification Retry] id={}, reason={}", outboxEventId, e.getMessage());
                        event.recordRetryOrFail();
                    }
                })
        );
    }
}

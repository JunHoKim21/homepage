package com.starterkit.domain.inquiry;

import org.springframework.data.jpa.repository.JpaRepository;

import java.time.OffsetDateTime;
import java.util.List;

public interface OutboxEventRepository extends JpaRepository<OutboxEvent, Long> {
    List<OutboxEvent> findTop50ByStatusAndNextRetryAtLessThanEqualOrderByCreatedAtAsc(
            OutboxEvent.OutboxStatus status, OffsetDateTime now);
}

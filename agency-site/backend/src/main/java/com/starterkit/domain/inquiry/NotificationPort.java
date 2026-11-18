package com.starterkit.domain.inquiry;

public interface NotificationPort {
    void dispatchOutboxAsync(Long outboxEventId);
}

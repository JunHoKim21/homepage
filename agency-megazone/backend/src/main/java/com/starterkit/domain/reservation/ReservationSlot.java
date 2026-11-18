package com.starterkit.domain.reservation;

import com.starterkit.common.exception.BusinessException;
import com.starterkit.common.exception.ErrorCode;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.OffsetDateTime;

@Entity
@Table(name = "reservation_slots")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ReservationSlot {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "slot_date", nullable = false)
    private LocalDate slotDate;

    @Column(name = "slot_time", nullable = false)
    private LocalTime slotTime;

    @Column(name = "service_name", nullable = false, length = 100)
    private String serviceName;

    @Column(name = "max_capacity", nullable = false)
    private int maxCapacity;

    @Column(name = "reserved_count", nullable = false)
    private int reservedCount;

    @Column(name = "is_closed", nullable = false)
    private boolean closed;

    @Column(name = "created_at", nullable = false, updatable = false)
    private OffsetDateTime createdAt;

    @Builder
    public ReservationSlot(LocalDate slotDate, LocalTime slotTime, String serviceName,
                           int maxCapacity, boolean closed) {
        this.slotDate = slotDate;
        this.slotTime = slotTime;
        this.serviceName = serviceName != null && !serviceName.isBlank() ? serviceName : "DEFAULT";
        this.maxCapacity = Math.max(1, maxCapacity);
        this.reservedCount = 0;
        this.closed = closed;
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = OffsetDateTime.now();
    }

    /**
     * SINGLE 모드일 경우 실질 유효 정원을 1로 제한하고, MULTI 모드일 경우 설정된 maxCapacity를 사용합니다.
     */
    public void reserve(int visitorCount, boolean singleCapacityMode) {
        if (this.closed) {
            throw new BusinessException(ErrorCode.RESERVATION_SLOT_CLOSED);
        }
        int effectiveMax = singleCapacityMode ? 1 : this.maxCapacity;
        int requested = singleCapacityMode ? 1 : Math.max(1, visitorCount);

        if (this.reservedCount + requested > effectiveMax) {
            throw new BusinessException(ErrorCode.RESERVATION_CAPACITY_EXCEEDED);
        }
        this.reservedCount += requested;
    }

    public void release(int visitorCount) {
        this.reservedCount = Math.max(0, this.reservedCount - Math.max(1, visitorCount));
    }

    public void updateSlotConfig(int maxCapacity, boolean closed) {
        if (maxCapacity < this.reservedCount) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "현재 예약된 인원보다 적은 정원으로 변경할 수 없습니다.");
        }
        this.maxCapacity = Math.max(1, maxCapacity);
        this.closed = closed;
    }

    public void toggleClosed() {
        this.closed = !this.closed;
    }

    public boolean isAvailable(boolean singleCapacityMode) {
        if (this.closed) {
            return false;
        }
        int effectiveMax = singleCapacityMode ? 1 : this.maxCapacity;
        return this.reservedCount < effectiveMax;
    }
}

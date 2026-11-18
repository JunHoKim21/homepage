package com.starterkit.domain.reservation;

import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface ReservationSlotRepository extends JpaRepository<ReservationSlot, Long> {

    List<ReservationSlot> findBySlotDateOrderBySlotTimeAsc(LocalDate slotDate);

    List<ReservationSlot> findBySlotDateBetweenOrderBySlotDateAscSlotTimeAsc(LocalDate startDate, LocalDate endDate);

    boolean existsBySlotDateAndSlotTimeAndServiceName(LocalDate slotDate, java.time.LocalTime slotTime, String serviceName);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT rs FROM ReservationSlot rs WHERE rs.id = :slotId")
    Optional<ReservationSlot> findByIdForUpdate(@Param("slotId") Long slotId);
}

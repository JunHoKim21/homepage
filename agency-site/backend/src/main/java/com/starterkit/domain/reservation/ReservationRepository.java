package com.starterkit.domain.reservation;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {

    @Query("SELECT r FROM Reservation r JOIN FETCH r.slot s ORDER BY r.createdAt DESC")
    List<Reservation> findAllWithSlotOrderByCreatedAtDesc();

    @Query("SELECT r FROM Reservation r JOIN FETCH r.slot s WHERE r.publicId = :publicId")
    Optional<Reservation> findByPublicIdWithSlot(UUID publicId);

    @Query("SELECT r FROM Reservation r JOIN FETCH r.slot s WHERE r.id = :id")
    Optional<Reservation> findByIdWithSlot(Long id);
}

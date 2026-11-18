package com.starterkit.domain.inquiry;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface InquiryRepository extends JpaRepository<Inquiry, Long> {
    List<Inquiry> findByDeletedAtIsNullOrderByCreatedAtDesc();
    List<Inquiry> findByStatusAndDeletedAtIsNullOrderByCreatedAtDesc(Inquiry.InquiryStatus status);
    Optional<Inquiry> findByPublicIdAndDeletedAtIsNull(UUID publicId);
    Optional<Inquiry> findByIdAndDeletedAtIsNull(Long id);
}

package com.starterkit.domain.member;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface MemberRepository extends JpaRepository<Member, Long> {
    Optional<Member> findByEmailAndDeletedAtIsNull(String email);
    Optional<Member> findByPublicIdAndDeletedAtIsNull(UUID publicId);
    boolean existsByEmailAndDeletedAtIsNull(String email);
}

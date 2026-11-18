package com.starterkit.infra.config;

import com.starterkit.domain.member.Admin;
import com.starterkit.domain.member.AdminRepository;
import com.starterkit.domain.member.Role;
import com.starterkit.domain.member.RoleRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.support.TransactionTemplate;

@Slf4j
@Configuration
@RequiredArgsConstructor
public class AdminBootstrapConfig {

    private final AdminRepository adminRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final TransactionTemplate transactionTemplate;

    @Bean
    public ApplicationRunner seedDefaultSuperAdminRunner() {
        return args -> transactionTemplate.executeWithoutResult(status -> {
            if (adminRepository.findByUsernameAndDeletedAtIsNull("admin").isEmpty()) {
                Role superAdminRole = roleRepository.findByRoleCode("ROLE_SUPER_ADMIN")
                        .orElseGet(() -> roleRepository.save(Role.builder()
                                .roleCode("ROLE_SUPER_ADMIN")
                                .roleName("최고 시스템 관리자")
                                .system(true)
                                .build()));

                Admin defaultAdmin = Admin.builder()
                        .username("admin")
                        .passwordHash(passwordEncoder.encode("Admin1234!"))
                        .fullName("시스템 관리자")
                        .email("admin@starterkit.local")
                        .totpEnabled(false)
                        .build();
                defaultAdmin.addRole(superAdminRole);
                adminRepository.save(defaultAdmin);
                log.info("[Bootstrap] Default super admin 'admin' initialized.");
            }
        });
    }
}

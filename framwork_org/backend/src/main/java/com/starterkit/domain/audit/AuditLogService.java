package com.starterkit.domain.audit;

import com.starterkit.common.config.FeatureSwitch;
import com.starterkit.common.exception.BusinessException;
import com.starterkit.common.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AuditLogService {

    private final AuditLogRepository auditLogRepository;
    private final FeatureSwitch featureSwitch;

    public record AuditLogItemResult(
            Long id,
            String actionType,
            String domainType,
            String targetId,
            String actorId,
            String clientIp,
            String beforeState,
            String afterState,
            OffsetDateTime createdAt
    ) {}

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void record(String actionType, String domainType, String targetId,
                       String actorId, String clientIp, String beforeState, String afterState) {
        if (!featureSwitch.isAuditLogEnabled()) {
            return;
        }
        auditLogRepository.save(AuditLogEntry.builder()
                .actionType(actionType)
                .domainType(domainType)
                .targetId(targetId)
                .actorId(actorId)
                .clientIp(clientIp)
                .beforeState(beforeState)
                .afterState(afterState)
                .build());
    }

    @Transactional(readOnly = true)
    public List<AuditLogItemResult> listRecentLogs() {
        if (!featureSwitch.isAuditLogEnabled()) {
            throw new BusinessException(ErrorCode.FEATURE_DISABLED, "감사 로그 기능이 비활성화되어 있습니다.");
        }
        return auditLogRepository.findTop100ByOrderByCreatedAtDesc()
                .stream()
                .map(e -> new AuditLogItemResult(
                        e.getId(),
                        e.getActionType(),
                        e.getDomainType(),
                        e.getTargetId(),
                        e.getActorId(),
                        e.getClientIp(),
                        e.getBeforeState(),
                        e.getAfterState(),
                        e.getCreatedAt()
                ))
                .toList();
    }
}

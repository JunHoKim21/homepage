package com.starterkit.infra.audit;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.starterkit.common.config.FeatureSwitch;
import com.starterkit.common.security.AuthenticatedPrincipal;
import com.starterkit.domain.audit.AuditLog;
import com.starterkit.domain.audit.AuditLogService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

@Slf4j
@Aspect
@Component
@RequiredArgsConstructor
public class AuditLogAspect {

    private final AuditLogService auditLogService;
    private final FeatureSwitch featureSwitch;
    private final ObjectMapper objectMapper;

    @Around("@annotation(auditLog)")
    public Object captureAuditLog(ProceedingJoinPoint joinPoint, AuditLog auditLog) throws Throwable {
        if (!featureSwitch.isAuditLogEnabled()) {
            return joinPoint.proceed();
        }

        String actorId = resolveActorId();
        String clientIp = resolveClientIp();
        String argsJson = safeSerialize(joinPoint.getArgs());

        Object result = joinPoint.proceed();

        String resultJson = safeSerialize(result);
        String targetId = extractTargetId(joinPoint.getArgs());

        try {
            auditLogService.record(
                    auditLog.actionType(),
                    auditLog.domainType(),
                    targetId,
                    actorId,
                    clientIp,
                    argsJson,
                    resultJson
            );
        } catch (Exception e) {
            log.warn("[AuditLogAspect] 감사 로그 저장 중 오류 (본 작업은 정상 완료): {}", e.getMessage());
        }

        return result;
    }

    private String resolveActorId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getPrincipal() instanceof AuthenticatedPrincipal principal) {
            return principal.identifier();
        }
        return auth != null ? auth.getName() : "SYSTEM";
    }

    private String resolveClientIp() {
        if (RequestContextHolder.getRequestAttributes() instanceof ServletRequestAttributes attrs) {
            HttpServletRequest req = attrs.getRequest();
            if (req.getRemoteAddr() != null) {
                return req.getRemoteAddr();
            }
        }
        return "0.0.0.0";
    }

    private String extractTargetId(Object[] args) {
        if (args == null || args.length == 0 || args[0] == null) {
            return null;
        }
        String first = String.valueOf(args[0]);
        return first.length() > 100 ? first.substring(0, 100) : first;
    }

    private String safeSerialize(Object target) {
        if (target == null) {
            return null;
        }
        try {
            String json = objectMapper.writeValueAsString(target);
            return json.length() > 8000 ? "{\"truncated\":true}" : json;
        } catch (Exception e) {
            return "{\"unserializable\":true}";
        }
    }
}

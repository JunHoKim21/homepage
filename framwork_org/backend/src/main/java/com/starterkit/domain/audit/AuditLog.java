package com.starterkit.domain.audit;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface AuditLog {
    String actionType(); // CREATE, UPDATE, DELETE, EXPORT, REFUND
    String domainType(); // CONFIG, INQUIRY, RESERVATION, ORDER, MEMBER, ADMIN
}

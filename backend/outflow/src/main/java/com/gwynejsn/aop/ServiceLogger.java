package com.gwynejsn.aop;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.annotation.Pointcut;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
@Aspect
public class ServiceLogger {
    private final Logger log = LoggerFactory.getLogger(ServiceLogger.class);

    @Pointcut("execution(* com.gwynejsn.service.*.*(..))")
    public void logServiceMethods() {}

    @Before("logServiceMethods()")
    public void logBefore(JoinPoint joinPoint) {
        log.info(
                "Called service method: {} with arguments: {}",
                joinPoint.getSignature().getName(), joinPoint.getArgs()
        );
    }

    @AfterReturning(pointcut = "logServiceMethods()", returning = "result")
    public void logAfterReturning(JoinPoint joinPoint, Object result) {
        var authentication = SecurityContextHolder.getContext().getAuthentication();

        String username = (authentication != null && authentication.isAuthenticated())
                ? authentication.getName()
                : "ANONYMOUS";

        log.info(
                "User [{}] called Service method: {} returned: {}",
                username, joinPoint.getSignature().getName(), result
        );
    }
}

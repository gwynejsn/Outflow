package com.gwynejsn.scheduler;

import com.gwynejsn.service.EmailNotificationService;
import com.gwynejsn.service.SubscriptionService;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class SubscriptionExpirationNotificationScheduler {
    private EmailNotificationService emailNotificationService;
    private SubscriptionService subscriptionService;

    public SubscriptionExpirationNotificationScheduler(EmailNotificationService emailNotificationService, SubscriptionService subscriptionService) {
        this.emailNotificationService = emailNotificationService;
        this.subscriptionService = subscriptionService;
    }

    // everyday, scan for expiring subscriptions and send email
    @Scheduled(cron = "0 0 0 * * ?")
    public void emailSubscriptionExpirationNotification() {
        subscriptionService.getExpiringSubscriptions().forEach(subscription -> {
            emailNotificationService.sendSubscriptionExpirationWarning(subscription);
        });
    }
}

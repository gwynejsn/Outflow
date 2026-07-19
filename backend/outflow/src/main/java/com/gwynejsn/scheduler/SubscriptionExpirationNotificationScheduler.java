package com.gwynejsn.scheduler;

import com.gwynejsn.enums.ExpirationType;
import com.gwynejsn.model.Notification;
import com.gwynejsn.model.Subscription;
import com.gwynejsn.service.EmailNotificationService;
import com.gwynejsn.service.InAppNotificationService;
import com.gwynejsn.service.SubscriptionService;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class SubscriptionExpirationNotificationScheduler {
    private final EmailNotificationService emailNotificationService;
    private final InAppNotificationService inAppNotificationService;
    private final SubscriptionService subscriptionService;


    public SubscriptionExpirationNotificationScheduler(EmailNotificationService emailNotificationService, SubscriptionService subscriptionService, InAppNotificationService inAppNotificationService) {
        this.emailNotificationService = emailNotificationService;
        this.subscriptionService = subscriptionService;
        this.inAppNotificationService = inAppNotificationService;
    }

    // everyday, scan for expiring subscriptions and send email
    @Scheduled(cron = "0 0 0 * * ?")
    public void emailSubscriptionExpirationNotification() {
        subscriptionService.getExpiringSubscriptions().forEach(expiringSubscription -> {
            emailNotificationService.sendSubscriptionExpirationWarning(expiringSubscription.subscription());
        });
    }

    @Scheduled(cron = "0 0 0 * * ?")
    public void updateInAppNotificationSubscriptionExpiration() {
        subscriptionService.getExpiringSubscriptions().forEach(expiringSubscription -> {
            Subscription s = expiringSubscription.subscription();
            int daysLeft = expiringSubscription.noOfDaysLeft();

            boolean isExpired = daysLeft <= 0;
            ExpirationType status = isExpired ? ExpirationType.EXPIRED : ExpirationType.NEARING_EXPIRATION;
            String message = isExpired ? "Your subscription is expired!" : "Your subscription will expire in " + daysLeft + " days!";

            Notification notification = inAppNotificationService.notificationExistForSubscription(s.getId());

            if (notification == null) {
                // create a new notification if not yet exist
                inAppNotificationService.createNotification(
                        new Notification(status, message, s.getUser(), s)
                );
            } else {
                // edit current notification
                notification.setExpirationType(status);
                notification.setMessage(message);

                inAppNotificationService.updateNotification(notification);
            }
        });
    }

}

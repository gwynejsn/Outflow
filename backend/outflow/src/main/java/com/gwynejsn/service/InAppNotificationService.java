package com.gwynejsn.service;

import com.gwynejsn.dao.NotificationDao;
import com.gwynejsn.enums.ExpirationType;
import com.gwynejsn.model.Notification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class InAppNotificationService {
    private final NotificationDao notificationDao;

    public InAppNotificationService(NotificationDao notificationDao) {
        this.notificationDao = notificationDao;
    }

    public List<Notification> getAllNotifications(UUID userId) {
        return notificationDao.findAllByUserId(userId);
    }

    public List<Notification> getAllNotifications(UUID userId, ExpirationType expirationType) {
        return notificationDao.findAllByUserIdAndExpirationType(userId, expirationType);
    }

    @Transactional
    public void updateNotification(Notification notification) {
        notificationDao.save(notification);
    }

    @Transactional
    public void createNotification(Notification notification) {
        notificationDao.save(notification);
    }

    @Transactional
    public void clearNotifications(UUID userId) {
        notificationDao.deleteAllByUser_Id(userId);
    }

    public Notification notificationExistForSubscription(UUID subscriptionId) {
        return notificationDao.findBySubscription_Id(subscriptionId);
    }
}

package com.gwynejsn.dao;

import com.gwynejsn.enums.ExpirationType;
import com.gwynejsn.model.Notification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface NotificationDao extends JpaRepository<Notification, UUID> {

    public List<Notification> findAllByUserId(UUID userId);

    public List<Notification> findAllByUserIdAndExpirationType(UUID userId, ExpirationType type);

    Notification findBySubscription_Id(UUID subscriptionId);

    void deleteAllByUser_Id(UUID userId);
}

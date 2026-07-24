package com.gwynejsn.service;

import com.gwynejsn.dao.SubscriptionDao;
import com.gwynejsn.exception.AlreadyExistException;
import com.gwynejsn.exception.NotFoundException;
import com.gwynejsn.model.ExpiringSubscription;
import com.gwynejsn.model.Subscription;
import com.gwynejsn.model.User;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class SubscriptionService {
    private final SubscriptionDao subscriptionDao;
    private final UserService userService;
    @Value("${notification.expiration.email.lead.time}")
    private int emailExpirationNotificationLeadTime;

    public SubscriptionService(SubscriptionDao subscriptionDao, UserService userService) {
        this.subscriptionDao = subscriptionDao;
        this.userService = userService;
    }

    public List<Subscription> getAllSubscriptions() {
        return subscriptionDao.findAll();
    }

    public List<Subscription> getSubscriptionsByUserId(UUID userId) {
        return subscriptionDao.findSubscriptionByUserId(userId);
    }

    public Subscription getSubscriptionByIdFromUserId(UUID userId, UUID subscriptionId) {
        Subscription subscription = subscriptionDao.findByIdAndUserId(userId, subscriptionId);
        if (subscription == null) {
            throw new NotFoundException("Subscription with id " + subscriptionId + " not found");
        }
        return subscription;
    }

    public Subscription getSubscriptionById(UUID id) {
        return subscriptionDao.findById(id)
                .orElseThrow(() -> new NotFoundException("Subscription with id " + id + " does not exist"));
    }

    public List<ExpiringSubscription> getExpiringSubscriptions() {
        return subscriptionDao.findSubscriptionsExpiringBetween(
                LocalDateTime.now(),
                LocalDateTime.now().plusDays(emailExpirationNotificationLeadTime)
        );
    }

    @Transactional
    public Subscription saveSubscription(String email, Subscription subscription) {
        User user = userService.findByEmail(email);
        if (subscriptionDao.existsByTitle(subscription.getTitle())) {
            throw new AlreadyExistException("Subscription with title " + subscription.getTitle() + " already exists");
        }
        subscription.setUser(user);
        subscription.setCreatedAt(LocalDateTime.now());
        Subscription savedSubscription = subscriptionDao.save(subscription);

        user.getSubscriptions().add(savedSubscription);

        return savedSubscription;
    }

    @Transactional
    public Subscription updateSubscription(UUID id, Subscription updatedFields) {
        if (!subscriptionDao.existsById(id)) {
            throw new NotFoundException("Cannot update. Subscription with id " + id + " does not exist");
        }
        return subscriptionDao.save(updatedFields);
    }

    @Transactional
    public void deleteSubscription(UUID id) {
        if (!subscriptionDao.existsById(id)) {
            throw new NotFoundException("Cannot delete. Subscription with id " + id + " does not exist");
        }
        subscriptionDao.deleteById(id);
    }
}
package com.gwynejsn.service;

import com.gwynejsn.dao.SubscriptionDao;
import com.gwynejsn.model.Subscription;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class SubscriptionService {
    private final SubscriptionDao subscriptionDao;

    public SubscriptionService(SubscriptionDao subscriptionDao) {
        this.subscriptionDao = subscriptionDao;
    }

    public List<Subscription> getAllSubscriptions() {
        return subscriptionDao.findAll();
    }

    public Subscription getSubscriptionById(UUID id) {
        return subscriptionDao.findById(id).orElse(null);
    }

    public Subscription saveSubscription(Subscription subscription) {
        return subscriptionDao.save(subscription);
    }

    public Subscription updateSubscription(Subscription subscription) {
        return subscriptionDao.save(subscription);
    }

    public void deleteSubscription(UUID id) {
        subscriptionDao.deleteById(id);
    }
}

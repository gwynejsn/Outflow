package com.gwynejsn.service;

import com.gwynejsn.dao.SubscriptionDao;
import com.gwynejsn.exception.AlreadyExistException;
import com.gwynejsn.exception.NotFoundException;
import com.gwynejsn.model.Subscription;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
        return subscriptionDao.findById(id)
                .orElseThrow(() -> new NotFoundException("Subscription with id " + id + " does not exist"));
    }

    @Transactional
    public Subscription saveSubscription(Subscription subscription) {
        if (subscriptionDao.existsById(subscription.getId())) {
            throw new AlreadyExistException("Subscription with id " + subscription.getId() + " already exists");
        } else if (subscriptionDao.existsByTitle(subscription.getTitle())) {
            throw new AlreadyExistException("Subscription with title " + subscription.getTitle() + " already exists");
        }
        return subscriptionDao.save(subscription);
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
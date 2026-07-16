package com.gwynejsn.dao;

import com.gwynejsn.model.Subscription;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface SubscriptionDao extends JpaRepository<Subscription, UUID> {
    public boolean existsByTitle(String title);
}

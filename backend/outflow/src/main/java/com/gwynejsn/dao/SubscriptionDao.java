package com.gwynejsn.dao;

import com.gwynejsn.model.Subscription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public interface SubscriptionDao extends JpaRepository<Subscription, UUID> {
    public boolean existsByTitle(String title);

    @Query("SELECT s FROM Subscription s " +
            "WHERE s.expiresAt >= :startOfExp " +
            "AND s.expiresAt <= :endOfExp")
    List<Subscription> findSubscriptionsExpiringBetween(
            @Param("startOfExp") LocalDateTime startOfExp,
            @Param("endOfExp") LocalDateTime endOfExp
    );
}

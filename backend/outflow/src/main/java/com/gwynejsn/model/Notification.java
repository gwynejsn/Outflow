package com.gwynejsn.model;

import com.gwynejsn.enums.ExpirationType;
import jakarta.persistence.*;
import org.hibernate.annotations.UuidGenerator;
import org.springframework.lang.NonNull;

import java.util.UUID;

@Entity
public class Notification {
    @Id
    @UuidGenerator
    private UUID id;
    private ExpirationType expirationType;
    private String message;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    @OneToOne
    private Subscription subscription;

    public Notification() {
    }

    public Notification(ExpirationType expirationType, String message, User user, Subscription subscription) {
        this.expirationType = expirationType;
        this.message = message;
        this.user = user;
        this.subscription = subscription;
    }

    @NonNull
    public UUID getId() {
        return id;
    }

    public void setId(@NonNull UUID id) {
        this.id = id;
    }

    public ExpirationType getExpirationType() {
        return expirationType;
    }

    public void setExpirationType(ExpirationType expirationType) {
        this.expirationType = expirationType;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Subscription getSubscription() {
        return subscription;
    }

    public void setSubscription(Subscription subscription) {
        this.subscription = subscription;
    }
}

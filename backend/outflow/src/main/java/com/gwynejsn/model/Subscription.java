package com.gwynejsn.model;

import com.gwynejsn.enums.Category;
import jakarta.persistence.*;
import org.hibernate.annotations.UuidGenerator;
import org.springframework.lang.NonNull;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
public class Subscription {
    @Id
    @UuidGenerator
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;
    private String title;
    private String description;
    private Float price;
    @Column(name = "image_url")
    private String imageUrl;
    private Category category;
    private LocalDateTime createdAt;
    private LocalDateTime renewedAt;
    private LocalDateTime expiresAt;

    public Subscription() {}

    public Subscription(String title, String description, Float price, String imageUrl, Category category, LocalDateTime createdAt, LocalDateTime renewedAt, LocalDateTime expiresAt) {
        this.title = title;
        this.description = description;
        this.price = price;
        this.imageUrl = imageUrl;
        this.category = category;
        this.createdAt = createdAt;
        this.renewedAt = renewedAt;
        this.expiresAt = expiresAt;
    }

    @NonNull
    public UUID getId() {
        return id;
    }

    public void setId(@NonNull UUID id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Float getPrice() {
        return price;
    }

    public void setPrice(Float price) {
        this.price = price;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getRenewedAt() {
        return renewedAt;
    }

    public void setRenewedAt(LocalDateTime renewedAt) {
        this.renewedAt = renewedAt;
    }

    public LocalDateTime getExpiresAt() {
        return expiresAt;
    }

    public void setExpiresAt(LocalDateTime expiresAt) {
        this.expiresAt = expiresAt;
    }
}

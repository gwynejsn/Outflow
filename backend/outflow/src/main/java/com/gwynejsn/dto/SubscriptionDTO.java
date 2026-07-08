package com.gwynejsn.dto;

import com.gwynejsn.enums.Category;

import java.time.LocalDateTime;
import java.util.UUID;

public record SubscriptionDTO(
    UUID id,
    String title,
    String description,
    Float price,
    String imageUrl,
    Category category,
    LocalDateTime renewedAt,
    LocalDateTime expiresAt
){
}

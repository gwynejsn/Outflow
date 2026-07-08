package com.gwynejsn.dto;

import com.gwynejsn.enums.Category;
import java.time.LocalDateTime;

public record SubscriptionCreateDto(
        String title,
        String description,
        Float price,
        String imageUrl,
        Category category,
        LocalDateTime expiresAt
) {}
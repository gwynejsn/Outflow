package com.gwynejsn.dto.subscription;

import com.gwynejsn.enums.Category;
import com.gwynejsn.enums.Cycle;

import java.time.LocalDateTime;

public record SubscriptionCreateDto(
        String title,
        String description,
        Float price,
        String imageUrl,
        Cycle cycle,
        Category category,
        LocalDateTime expiresAt
) {}
package com.gwynejsn.dto.notification;

import com.gwynejsn.enums.ExpirationType;

import java.util.UUID;

public record NotificationDto(
        UUID id,
        ExpirationType expirationType,
        String message,
        UUID subscriptionId
) {
}

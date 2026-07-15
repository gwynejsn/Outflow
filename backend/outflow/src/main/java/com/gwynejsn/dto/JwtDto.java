package com.gwynejsn.dto;

import java.time.LocalDateTime;

public record JwtDto(
        String jwt,
        LocalDateTime expiration
) {
}

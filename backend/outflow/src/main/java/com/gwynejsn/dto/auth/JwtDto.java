package com.gwynejsn.dto.auth;

import java.time.LocalDateTime;

public record JwtDto(
        String jwt,
        LocalDateTime expiration
) {
}

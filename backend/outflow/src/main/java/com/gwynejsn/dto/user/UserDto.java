package com.gwynejsn.dto.user;

import com.gwynejsn.enums.Role;

public record UserDto(
        java.util.UUID id,
        Role role,
        String firstName,
        String lastName,
        String email
) {
}

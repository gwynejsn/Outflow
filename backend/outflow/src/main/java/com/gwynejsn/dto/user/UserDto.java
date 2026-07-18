package com.gwynejsn.dto.user;

import com.gwynejsn.enums.Role;

public record UserDto(
        String username,
        Role role,
        String firstName,
        String lastName,
        String email
) {
}

package com.gwynejsn.dto.user;

import com.gwynejsn.enums.Role;

public record UserCreateDto(
        String username,
        String password,
        Role role,
        String firstName,
        String lastName,
        String email
) {
}

package com.gwynejsn.dto.user;

import com.gwynejsn.enums.Role;

public record UserCreateDto(
        String email,
        String password,
        Role role,
        String firstName,
        String lastName
) {
}

package com.gwynejsn.dto.user;

import com.gwynejsn.enums.Role;

public record UserUpdateDto (
        java.util.UUID id,
        String password,
        Role role,
        String firstName,
        String lastName,
        String email
){
}

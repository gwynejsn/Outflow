package com.gwynejsn.controller.user;

import com.gwynejsn.dto.user.UserDto;
import com.gwynejsn.dto.user.UserUpdateDto;
import com.gwynejsn.model.User;
import com.gwynejsn.service.UserService;
import com.gwynejsn.utils.mappers.UserMapper;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Manages own user account
 */
@RestController
@RequestMapping("/user/account")
public class AccountController {
    private final UserService userService;

    public AccountController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping()
    public ResponseEntity<UserDto> getAccount(HttpServletRequest request) {
        String currentUsername = request.getUserPrincipal().getName();

        User user = userService.findByUsername(currentUsername);

        return ResponseEntity.ok(UserMapper.INSTANCE.mapUserToDto(user));
    }

    @PutMapping("/update")
    public ResponseEntity<UserDto> updateAccount(
            HttpServletRequest request,
            @RequestBody UserUpdateDto userUpdateDto
    ) {
        String currentUsername = request.getUserPrincipal().getName();

        User currentUser = userService.findByUsername(currentUsername);

        UserMapper.INSTANCE.updateUserFromDto(userUpdateDto, currentUser);

        User updatedUser = userService.updateUser(currentUsername, currentUser);

        return ResponseEntity.ok(UserMapper.INSTANCE.mapUserToDto(updatedUser));
    }
}
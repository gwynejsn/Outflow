package com.gwynejsn.controller;

import com.gwynejsn.dto.auth.JwtDto;
import com.gwynejsn.dto.auth.LoginDto;
import com.gwynejsn.dto.user.UserCreateDto;
import com.gwynejsn.dto.user.UserDto;
import com.gwynejsn.model.User;
import com.gwynejsn.service.AuthService;
import com.gwynejsn.service.UserService;
import com.gwynejsn.utils.mappers.UserMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthService authService;
    private final UserService userService;

    public AuthController(AuthService authService, UserService userService) {
        this.authService = authService;
        this.userService = userService;
    }

    @PostMapping("/login")
    public JwtDto login(@RequestBody LoginDto loginDto) {
        return authService.login(loginDto.email(), loginDto.password());
    }

    @PostMapping("/create")
    public ResponseEntity<UserDto> createUser(@RequestBody UserCreateDto userCreateDto) {
        User user = UserMapper.INSTANCE.mapCreateUserDtoToUser(userCreateDto);
        User saved = userService.saveUser(user);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(UserMapper.INSTANCE.mapUserToDto(saved));
    }
}

package com.gwynejsn.controller;

import com.gwynejsn.dto.JwtDto;
import com.gwynejsn.dto.LoginDto;
import com.gwynejsn.service.AuthService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {
    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public JwtDto login(@RequestBody LoginDto loginDto) {
        return authService.login(loginDto.email(), loginDto.password());
    }
}

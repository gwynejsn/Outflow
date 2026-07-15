package com.gwynejsn.controller;

import com.gwynejsn.dto.UserCreateDto;
import com.gwynejsn.dto.UserDto;
import com.gwynejsn.model.User;
import com.gwynejsn.service.UserService;
import com.gwynejsn.utils.mappers.UserMapper;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/user")
public class UserController {
    private UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/create")
    @ResponseStatus(HttpStatus.CREATED)
    public UserDto createUser(@RequestBody UserCreateDto userCreateDto) {
        User userCreated = userService.saveUser(UserMapper.INSTANCE.mapCreateUserDtoToUser(userCreateDto));
        return UserMapper.INSTANCE.mapUserToDto(userCreated);
    }
}

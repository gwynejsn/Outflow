package com.gwynejsn.controller;

import com.gwynejsn.dto.UserCreateDto;
import com.gwynejsn.dto.UserDto;
import com.gwynejsn.dto.UserUpdateDto;
import com.gwynejsn.model.User;
import com.gwynejsn.service.UserService;
import com.gwynejsn.utils.mappers.UserMapper;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/users")
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping()
    public List<UserDto> getAllUsers() {
        return userService.getAllUsers().stream()
                .map(UserMapper.INSTANCE::mapUserToDto)
                .collect(Collectors.toList());
    }

    @GetMapping("/{username}")
    public UserDto getUserByUsername(@PathVariable("username") String username) {
        User user = userService.findByUsername(username);
        return UserMapper.INSTANCE.mapUserToDto(user);
    }

    @PostMapping("/create")
    @ResponseStatus(HttpStatus.CREATED)
    public UserDto createUser(@RequestBody UserCreateDto userCreateDto) {
        User user = UserMapper.INSTANCE.mapCreateUserDtoToUser(userCreateDto);
        User saved = userService.saveUser(user);
        return UserMapper.INSTANCE.mapUserToDto(saved);
    }

    @PutMapping("/update")
    public UserDto updateUser(@RequestBody UserUpdateDto userUpdateDto) {
        User currentUser = userService.findByUsername(userUpdateDto.username());


        UserMapper.INSTANCE.updateUserFromDto(userUpdateDto, currentUser);

        User saved = userService.updateUser(userUpdateDto.username(), currentUser);
        return UserMapper.INSTANCE.mapUserToDto(saved);
    }

    @DeleteMapping("/delete/{username}")
    public void deleteUser(@PathVariable("username") String username) {
        userService.deleteUser(username);
    }
}
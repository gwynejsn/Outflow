package com.gwynejsn.controller.admin;

import com.gwynejsn.dto.user.UserCreateDto;
import com.gwynejsn.dto.user.UserDto;
import com.gwynejsn.dto.user.UserUpdateDto;
import com.gwynejsn.model.User;
import com.gwynejsn.service.UserService;
import com.gwynejsn.utils.mappers.UserMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Admin can manage any users
 */
@RestController
@RequestMapping("/api/admin/users")
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping()
    public ResponseEntity<List<UserDto>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers().stream()
                .map(UserMapper.INSTANCE::mapUserToDto)
                .collect(Collectors.toList()));
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<UserDto> getUserByEmail(@PathVariable("email") String email) {
        User user = userService.findByEmail(email);
        return ResponseEntity.ok(UserMapper.INSTANCE.mapUserToDto(user));
    }

    @PostMapping("/create")
    public ResponseEntity<UserDto> createUser(@RequestBody UserCreateDto userCreateDto) {
        User user = UserMapper.INSTANCE.mapCreateUserDtoToUser(userCreateDto);
        User saved = userService.saveUser(user);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(UserMapper.INSTANCE.mapUserToDto(saved));
    }

    @PutMapping("/update")
    public ResponseEntity<UserDto> updateUser(@RequestBody UserUpdateDto userUpdateDto) {
        User currentUser = userService.findById(userUpdateDto.id());

        UserMapper.INSTANCE.updateUserFromDto(userUpdateDto, currentUser);

        User saved = userService.updateUser(userUpdateDto.id(), currentUser, userUpdateDto.password());
        return ResponseEntity.ok(UserMapper.INSTANCE.mapUserToDto(saved));
    }

    @DeleteMapping("/delete/{id}")
    public void deleteUser(@PathVariable("id") java.util.UUID id) {
        userService.deleteUser(id);
    }
}
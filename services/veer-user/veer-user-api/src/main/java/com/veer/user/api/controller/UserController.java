package com.veer.user.api.controller;

import com.veer.user.model.dto.CreateUserDto;
import com.veer.user.model.dto.ResponseUserDto;
import com.veer.user.model.dto.UpdateUserDto;
import com.veer.user.service.UserService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/user")
@Validated
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping
    public ResponseEntity<ResponseUserDto> createUser(
        @RequestHeader("X-User-Id")      @NotBlank String userId,
        @RequestHeader("X-User-Email")   @NotBlank String userEmail,
        @RequestHeader("X-User-Name")    @NotBlank String userName,
        @RequestHeader("X-User-Country") @NotBlank String userCountry
    ) {
        CreateUserDto createUserDto = CreateUserDto.builder()
            .id(userId)
            .email(userEmail)
            .username(userName)
            .country(userCountry)
            .build();

        ResponseUserDto createdUser = userService.createUser(createUserDto);

        return ResponseEntity.status(HttpStatus.CREATED).body(createdUser);
    }

    @GetMapping
    public ResponseEntity<ResponseUserDto> getUserPrivateData(
        @RequestHeader("X-User-Id") @NotBlank String userId
    ) {
        ResponseUserDto user = userService.getUserById(userId);
        return ResponseEntity.ok(user);
    }

    @GetMapping("/{userId}")
    public ResponseEntity<ResponseUserDto> getUserPublicData(
        @PathVariable @NotBlank String userId
    ) {
        ResponseUserDto user = userService.getUserById(userId);

        user.setEmail(null); // for now the only private data is the email

        return ResponseEntity.ok(user);
    }

    @PatchMapping
    public ResponseEntity<ResponseUserDto> updateUser(
        @RequestHeader("X-User-Id") @NotBlank String userId,
        @RequestBody @Valid UpdateUserDto updateUserDto
    ) {
        updateUserDto.setId(userId);
        ResponseUserDto user = userService.updateUser(updateUserDto);
        return ResponseEntity.ok(user);
    }

    @DeleteMapping
    public ResponseEntity<Void> deleteUser(
        @RequestHeader("X-User-Id") @NotBlank String userId
    ) {
        userService.deleteUserById(userId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{followedUserId}/follow")
    public ResponseEntity<ResponseUserDto> followUser(
        @RequestHeader("X-User-Id") @NotBlank String userId,
        @PathVariable @NotBlank String followedUserId
    ) {
        ResponseUserDto followedUser = userService.createFollowRelationship(userId, followedUserId);
        return ResponseEntity.ok(followedUser);
    }

    @DeleteMapping("/{followedUserId}/follow")
    public ResponseEntity<Void> unfollowUser(
        @RequestHeader("X-User-Id") @NotBlank String userId,
        @PathVariable @NotBlank String followedUserId
    ) {
        userService.deleteFollowRelationship(userId, followedUserId);
        return ResponseEntity.noContent().build();
    }

}
package com.veer.user.api.controller;

import com.veer.user.model.dto.CreateUserDto;
import com.veer.user.model.dto.ResponseUserDto;
import com.veer.user.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.constraints.NotBlank;

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

}
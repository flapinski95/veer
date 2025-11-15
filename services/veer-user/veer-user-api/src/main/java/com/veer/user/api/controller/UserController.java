package com.veer.user.api.controller;

import com.veer.user.model.dto.CreateUserDto;
import com.veer.user.model.dto.ResponseUserDto;
import com.veer.user.model.dto.UpdateUserDto;
import com.veer.user.service.UserService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/user")
@Validated
@Tag(
    name = "User", 
    description = 
    "API for managing user profiles, data, and follow relationships." +
    "All requests are expected to already be authenticated by the gateway." +
    "Information retrieved by that authentication is expected to be passed " +
    "in the request headers by the gateway, while other information is" +
    "expected to be passed in the request body by the sender."
)
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @Operation(
        summary = "Create a new user",
        description = 
        "Creates a new user in the database with the provided" +
        " information from request headers. This is expected to be called by" +
        " the gateway after user's first authentication."
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "201",
            description = "User created successfully",
            content = @Content(schema = @Schema(implementation = ResponseUserDto.class))
        ),
        @ApiResponse(
            responseCode = "400",
            description = "Invalid input parameters"
        ),
        @ApiResponse(
            responseCode = "409",
            description = "User already exists"
        ),
    })
    @PostMapping
    public ResponseEntity<ResponseUserDto> createUser(
        @Parameter(description = "User ID", required = true)
        @RequestHeader("X-User-Id") @NotBlank String userId,

        @Parameter(description = "User email address", required = true)
        @RequestHeader("X-User-Email") @NotBlank String userEmail,

        @Parameter(description = "Username", required = true)
        @RequestHeader("X-User-Name") @NotBlank String userName,

        @Parameter(description = "User country code", required = true)
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

    @Operation(
        summary = "Get authenticated user's private data",
        description = "Retrieves the authenticated user's private profile data including email"
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "User data retrieved successfully",
            content = @Content(schema = @Schema(implementation = ResponseUserDto.class))
        ),
        @ApiResponse(
            responseCode = "400",
            description = "Invalid input parameters"
        ),
        @ApiResponse(
            responseCode = "404",
            description = "User not found"
        )
    })
    @GetMapping
    public ResponseEntity<ResponseUserDto> getUserPrivateData(
        @Parameter(description = "User ID", required = true)
        @RequestHeader("X-User-Id") @NotBlank String userId
    ) {
        ResponseUserDto user = userService.getUserById(userId);
        return ResponseEntity.ok(user);
    }

    @Operation(
        summary = "Get user's public data",
        description = "Retrieves public profile data for any user"
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "User public data retrieved successfully",
            content = @Content(schema = @Schema(implementation = ResponseUserDto.class))
        ),
        @ApiResponse(
            responseCode = "400",
            description = "Invalid input parameters"
        ),
        @ApiResponse(
            responseCode = "404",
            description = "User not found"
        )
    })
    @GetMapping("/{userId}")
    public ResponseEntity<ResponseUserDto> getUserPublicData(
        @Parameter(description = "User ID to retrieve", required = true)
        @PathVariable @NotBlank String userId
    ) {
        ResponseUserDto user = userService.getUserPublicDataById(userId);

        return ResponseEntity.ok(user);
    }

    @Operation(
        summary = "Update user profile",
        description = "Updates the authenticated user's profile information"
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "User updated successfully",
            content = @Content(schema = @Schema(implementation = ResponseUserDto.class))
        ),
        @ApiResponse(
            responseCode = "400",
            description = "Invalid input data"
        ),
        @ApiResponse(
            responseCode = "404",
            description = "User not found"
        )
    })
    @PatchMapping
    public ResponseEntity<ResponseUserDto> updateUser(
        @Parameter(description = "User ID", required = true)
        @RequestHeader("X-User-Id") @NotBlank String userId,
        @Parameter(description = "User data to update", required = true)
        @RequestBody @Valid UpdateUserDto updateUserDto
    ) {
        updateUserDto.setId(userId);
        ResponseUserDto user = userService.updateUser(updateUserDto);
        return ResponseEntity.ok(user);
    }

    @Operation(
        summary = "Delete user account",
        description = "Permanently deletes the authenticated user's account"
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "204",
            description = "User deleted successfully"
        ),
        @ApiResponse(
            responseCode = "400",
            description = "Invalid input parameters"
        ),
        @ApiResponse(
            responseCode = "404",
            description = "User not found"
        )
    })
    @DeleteMapping
    public ResponseEntity<Void> deleteUser(
        @Parameter(description = "User ID", required = true)
        @RequestHeader("X-User-Id") @NotBlank String userId
    ) {
        userService.deleteUserById(userId);
        return ResponseEntity.noContent().build();
    }

    @Operation(
        summary = "Follow a user",
        description = "Creates a follow relationship where the authenticated user follows another user"
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "User followed successfully",
            content = @Content(schema = @Schema(implementation = ResponseUserDto.class))
        ),
        @ApiResponse(
            responseCode = "400",
            description = "Invalid input parameters"
        ),
        @ApiResponse(
            responseCode = "404",
            description = "User to follow not found"
        ),
        @ApiResponse(
            responseCode = "409",
            description = "User already followed"
        )
    })
    @PostMapping("/{followedUserId}/follow")
    public ResponseEntity<ResponseUserDto> followUser(
        @Parameter(description = "User ID", required = true)
        @RequestHeader("X-User-Id") @NotBlank String userId,
        @Parameter(description = "ID of the user to follow", required = true)
        @PathVariable @NotBlank String followedUserId
    ) {
        ResponseUserDto followedUser = userService.createFollowRelationship(userId, followedUserId);
        return ResponseEntity.ok(followedUser);
    }

    @Operation(
        summary = "Unfollow a user",
        description = "Removes the follow relationship between the authenticated user and another user"
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "204",
            description = "User unfollowed successfully"
        ),
        @ApiResponse(
            responseCode = "400",
            description = "Invalid input parameters"
        ),
        @ApiResponse(
            responseCode = "404",
            description = "Follow relationship not found"
        )
    })
    @DeleteMapping("/{followedUserId}/follow")
    public ResponseEntity<Void> unfollowUser(
        @Parameter(description = "User ID", required = true)
        @RequestHeader("X-User-Id") @NotBlank String userId,

        @Parameter(description = "ID of the user to unfollow", required = true)
        @PathVariable @NotBlank String followedUserId
    ) {
        userService.deleteFollowRelationship(userId, followedUserId);
        return ResponseEntity.noContent().build();
    }

}
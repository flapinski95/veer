package com.veer.user.model.dto;

import io.swagger.v3.oas.annotations.media.Schema;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Data transfer object representing user profile information.")
public class ResponseUserDto {

    @Schema(description = "User ID", 
            example = "123e4567-e89b-12d3-a456-426614174000")
    private String id;

    @Schema(description = "User email address (private data)",
            example = "user@example.com")
    private String email;

    @Schema(description = "Username", example = "macius112")
    private String username;

    @Schema(description = "User biography", 
            example = "Software developer and travel enthusiast")
    private String bio;

    @Schema(description = "Country code", 
            example = "US")
    private String country;

    @Schema(description = "Number of users this user is following", 
            example = "42")
    private int followingCount;

    @Schema(description = "Number of followers", 
            example = "128")
    private int followerCount;

    @Schema(description = "URL to user's profile picture", 
            example = "https://example.com/avatar.jpg")
    private String profilePicture;

    @Schema(description = "Timestamp when the user joined", 
            example = "2024-01-15T10:30:00Z")
    private Instant joinedAt;

}

package com.veer.user.model.dto;

import io.swagger.v3.oas.annotations.media.Schema;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.validation.constraints.Size;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Data transfer object for updating user profile information")
public class UpdateUserDto {

    @Schema(description = "User ID (not set in the request body, " + 
           "but set internally to match the user ID provided in the header)",
            hidden = true)
    private String id;

    @Schema(description = "Username (3-15 characters)", 
            example = "marcinek15", 
            minLength = 3, maxLength = 15)
    @Size(min = 3, max = 15)
    private String username;

    @Schema(description = "User biography (max 50 characters)", 
            example = "Software developer", 
            maxLength = 50)
    @Size(max = 50)
    private String bio;

    @Schema(description = "Country code (3-26 characters)", 
            example = "Poland", 
            minLength = 3, maxLength = 26)
    @Size(min = 3, max = 26)
    private String country;

    @Schema(description = "URL to user's profile picture", 
            example = "https://example.com/avatar.jpg")
    private String profilePicture;

}

package com.veer.user.model.dto;

import io.swagger.v3.oas.annotations.media.Schema;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Data transfer object for creating a new user." + 
"This information is expected to be passed in the request headers by the gateway.")
public class CreateUserDto {

    @Schema(description = "User ID", 
            example = "123e4567-e89b-12d3-a456-426614174000", 
            maxLength = 36)
    @NotBlank
    @Size(max = 36)
    private String id;

    @Schema(description = "User email address", 
            example = "kacper@example.com")
    @NotBlank
    @Email
    private String email;

    @Schema(description = "Username (3-15 characters)", 
            example = "kacperek123", 
            minLength = 3, maxLength = 15)
    @NotBlank
    @Size(min = 3, max = 15)
    private String username;

    @Schema(description = "Country code (3-26 characters)", 
            example = "US", 
            minLength = 3, 
            maxLength = 26)
    @NotBlank
    @Size(min = 3, max = 26)
    private String country;

}

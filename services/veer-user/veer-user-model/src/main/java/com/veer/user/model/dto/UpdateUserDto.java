package com.veer.user.model.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateUserDto {

    private String id; // Set internally from header, not from request body

    @Size(min = 3, max = 15)
    private String username;

    @Size(max = 50)
    private String bio;

    @Size(min = 3, max = 26)
    private String country;

    private String profilePicture;

}

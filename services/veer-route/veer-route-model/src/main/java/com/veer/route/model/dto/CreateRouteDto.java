package com.veer.route.model.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateRouteDto {

    @NotBlank
    @Size(max = 36)
    private String id;

    @Size(max = 36)
    private String createdBy;

    @NotNull
    private List<Map<String, Object>> points;

    @NotBlank
    @Size(min = 1, max = 255)
    private String name;

    @Size(max = 1000)
    private String description;

    @Builder.Default
    private Boolean isPublic = false;
}


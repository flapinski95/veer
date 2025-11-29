package com.veer.route.model.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateRouteDto {

    @NotBlank
    @Size(max = 36)
    private String id;

    private List<Map<String, Object>> points;

    @Size(min = 1, max = 255)
    private String name;

    @Size(max = 1000)
    private String description;

    private Boolean isPublic;

    private Double rating;
}


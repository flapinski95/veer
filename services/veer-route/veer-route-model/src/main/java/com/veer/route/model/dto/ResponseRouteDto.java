package com.veer.route.model.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.Instant;
import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ResponseRouteDto {

    private String id;

    private String createdBy;

    private List<Map<String, Object>> points;

    private String name;

    private String description;

    private Boolean isPublic;

    private Double rating;

    private Instant createdAt;

    private Instant lastUpdated;

}


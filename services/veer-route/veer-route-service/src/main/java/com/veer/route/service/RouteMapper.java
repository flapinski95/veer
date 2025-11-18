package com.veer.route.service;

import com.veer.route.model.Route;
import com.veer.route.model.dto.CreateRouteDto;
import com.veer.route.model.dto.ResponseRouteDto;
import com.veer.route.model.dto.UpdateRouteDto;

public class RouteMapper {

    public static Route toEntity(CreateRouteDto createRouteDto) {
        return Route.builder()
            .id(createRouteDto.getId())
            .createdBy(createRouteDto.getCreatedBy())
            .points(createRouteDto.getPoints())
            .name(createRouteDto.getName())
            .description(createRouteDto.getDescription())
            .isPublic(createRouteDto.getIsPublic())
            .build();
    }

    public static ResponseRouteDto toResponseRouteDto(Route route) {
        return ResponseRouteDto.builder()
            .id(route.getId())
            .createdBy(route.getCreatedBy())
            .points(route.getPoints())
            .name(route.getName())
            .description(route.getDescription())
            .isPublic(route.getIsPublic())
            .rating(route.getRating())
            .createdAt(route.getCreatedAt())
            .lastUpdated(route.getLastUpdated())
            .build();
    }

}


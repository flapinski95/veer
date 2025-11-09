package com.veer.route.api.controller;

import com.veer.route.model.dto.CreateRouteDto;
import com.veer.route.model.dto.ResponseRouteDto;
import com.veer.route.model.dto.UpdateRouteDto;
import com.veer.route.service.RouteService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;

@RestController
@RequestMapping("/api/route")
@Validated
public class RouteController {

    private final RouteService routeService;

    public RouteController(RouteService routeService) {
        this.routeService = routeService;
    }

    @PostMapping
    public ResponseEntity<ResponseRouteDto> createRoute(
        @RequestHeader("X-User-Id") @NotBlank String userId,
        @Valid @RequestBody CreateRouteDto createRouteDto
    ) {
        createRouteDto.setCreatedBy(userId);
        ResponseRouteDto createdRoute = routeService.createRoute(createRouteDto);

        return ResponseEntity.status(HttpStatus.CREATED).body(createdRoute);
    }

    @GetMapping("/{routeId}")
    public ResponseEntity<ResponseRouteDto> getRoute(
        @PathVariable @NotBlank String routeId
    ) {
        ResponseRouteDto route = routeService.getRouteById(routeId);
        return ResponseEntity.ok(route);
    }

    @PutMapping("/{routeId}")
    public ResponseEntity<ResponseRouteDto> updateRoute(
        @RequestHeader("X-User-Id") @NotBlank String userId,
        @PathVariable @NotBlank String routeId,
        @Valid @RequestBody UpdateRouteDto updateRouteDto
    ) {
        updateRouteDto.setId(routeId);
        ResponseRouteDto updatedRoute = routeService.updateRoute(updateRouteDto);
        return ResponseEntity.ok(updatedRoute);
    }

    @DeleteMapping("/{routeId}")
    public ResponseEntity<Void> deleteRoute(
        @RequestHeader("X-User-Id") @NotBlank String userId,
        @PathVariable @NotBlank String routeId
    ) {
        routeService.deleteRouteById(routeId);
        return ResponseEntity.noContent().build();
    }

}


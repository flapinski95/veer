package com.veer.route.api.controller;

import com.veer.route.model.dto.CreateRouteDto;
import com.veer.route.model.dto.ResponseRouteDto;
import com.veer.route.model.dto.UpdateRouteDto;
import com.veer.route.service.RouteService;

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

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;

import java.util.List;

@RestController
@RequestMapping("/api/route")
@Validated
@Tag(
    name = "Route",
    description =
    "API for managing routes, including creation, retrieval, update, and deletion." +
    "All requests are expected to already be authenticated by the gateway." +
    "Information retrieved by that authentication is expected to be passed " +
    "in the request headers by the gateway, while other information is" +
    "expected to be passed in the request body by the sender."
)
public class RouteController {

    private final RouteService routeService;

    public RouteController(RouteService routeService) {
        this.routeService = routeService;
    }

    @Operation(
        summary = "Create a new route",
        description =
        "Creates a new route in the database with the provided" +
        " information from request body. The user ID is expected to be passed" +
        " in the request header by the gateway after user's authentication."
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "201",
            description = "Route created successfully",
            content = @Content(schema = @Schema(implementation = ResponseRouteDto.class))
        ),
        @ApiResponse(
            responseCode = "400",
            description = "Invalid input parameters"
        ),
        @ApiResponse(
            responseCode = "409",
            description = "Route already exists"
        ),
    })
    @PostMapping
    public ResponseEntity<ResponseRouteDto> createRoute(
        @Parameter(description = "User ID", required = true)
        @RequestHeader("X-User-Id") @NotBlank String userId,
        @Parameter(description = "Route data to create", required = true)
        @Valid @RequestBody CreateRouteDto createRouteDto
    ) {
        createRouteDto.setCreatedBy(userId);
        ResponseRouteDto createdRoute = routeService.createRoute(createRouteDto);

        return ResponseEntity.status(HttpStatus.CREATED).body(createdRoute);
    }

    @Operation(
        summary = "Get route by ID",
        description = "Retrieves route data by route ID"
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Route retrieved successfully",
            content = @Content(schema = @Schema(implementation = ResponseRouteDto.class))
        ),
        @ApiResponse(
            responseCode = "400",
            description = "Invalid input parameters"
        ),
        @ApiResponse(
            responseCode = "404",
            description = "Route not found"
        )
    })
    @GetMapping("/{routeId}")
    public ResponseEntity<ResponseRouteDto> getRoute(
        @Parameter(description = "Route ID to retrieve", required = true)
        @PathVariable @NotBlank String routeId
    ) {
        ResponseRouteDto route = routeService.getRouteById(routeId);
        return ResponseEntity.ok(route);
    }

    @Operation(
        summary = "Get all routes by user ID",
        description = "Retrieves all routes created by a specific user"
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Routes retrieved successfully",
            content = @Content(schema = @Schema(implementation = ResponseRouteDto.class))
        ),
        @ApiResponse(
            responseCode = "400",
            description = "Invalid input parameters"
        )
    })
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ResponseRouteDto>> getRoutesByUserId(
        @Parameter(description = "User ID to retrieve routes for", required = true)
        @PathVariable @NotBlank String userId
    ) {
        List<ResponseRouteDto> routes = routeService.getRoutesByUserId(userId);
        return ResponseEntity.ok(routes);
    }

    @Operation(
        summary = "Update route",
        description = "Updates an existing route's information"
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Route updated successfully",
            content = @Content(schema = @Schema(implementation = ResponseRouteDto.class))
        ),
        @ApiResponse(
            responseCode = "400",
            description = "Invalid input data"
        ),
        @ApiResponse(
            responseCode = "404",
            description = "Route not found"
        )
    })
    @PutMapping("/{routeId}")
    public ResponseEntity<ResponseRouteDto> updateRoute(
        @Parameter(description = "User ID", required = true)
        @RequestHeader("X-User-Id") @NotBlank String userId,
        @Parameter(description = "Route ID to update", required = true)
        @PathVariable @NotBlank String routeId,
        @Parameter(description = "Route data to update", required = true)
        @Valid @RequestBody UpdateRouteDto updateRouteDto
    ) {
        updateRouteDto.setId(routeId);
        ResponseRouteDto updatedRoute = routeService.updateRoute(updateRouteDto);
        return ResponseEntity.ok(updatedRoute);
    }

    @Operation(
        summary = "Delete route",
        description = "Permanently deletes a route"
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "204",
            description = "Route deleted successfully"
        ),
        @ApiResponse(
            responseCode = "400",
            description = "Invalid input parameters"
        ),
        @ApiResponse(
            responseCode = "404",
            description = "Route not found"
        )
    })
    @DeleteMapping("/{routeId}")
    public ResponseEntity<Void> deleteRoute(
        @Parameter(description = "User ID", required = true)
        @RequestHeader("X-User-Id") @NotBlank String userId,
        @Parameter(description = "Route ID to delete", required = true)
        @PathVariable @NotBlank String routeId
    ) {
        routeService.deleteRouteById(routeId);
        return ResponseEntity.noContent().build();
    }

}


package com.veer.route.api.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.veer.route.api.exception.GlobalExceptionHandler;
import com.veer.route.model.dto.CreateRouteDto;
import com.veer.route.model.dto.ResponseRouteDto;
import com.veer.route.model.dto.UpdateRouteDto;
import com.veer.route.model.exception.RouteNotFoundException;
import com.veer.route.service.RouteService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.Instant;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.hamcrest.Matchers.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(RouteController.class)
@AutoConfigureMockMvc(addFilters = false)
@Import(GlobalExceptionHandler.class)
@DisplayName("RouteController Integration Tests")
class RouteControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private RouteService routeService;

    @BeforeEach
    void setUp() {
        reset(routeService);
    }

    private List<Map<String, Object>> createSamplePoints() {
        List<Map<String, Object>> points = new ArrayList<>();
        Map<String, Object> point1 = new HashMap<>();
        point1.put("latitude", 52.2297);
        point1.put("longitude", 21.0122);
        points.add(point1);
        Map<String, Object> point2 = new HashMap<>();
        point2.put("latitude", 52.4064);
        point2.put("longitude", 16.9252);
        points.add(point2);
        return points;
    }

    @Nested
    @DisplayName("POST /api/route - Create Route Tests")
    class CreateRouteTests {

        @Test
        @DisplayName("Should create route successfully with all required fields")
        void shouldCreateRouteSuccessfully() throws Exception {
            String userId = "test-user-123";
            String routeName = "Test Route";
            String routeDescription = "A test route description";
            List<Map<String, Object>> points = createSamplePoints();

            CreateRouteDto createRouteDto = CreateRouteDto.builder()
                .name(routeName)
                .description(routeDescription)
                .points(points)
                .isPublic(false)
                .build();

            ResponseRouteDto responseRouteDto = ResponseRouteDto.builder()
                .id("route-id-123")
                .createdBy(userId)
                .name(routeName)
                .description(routeDescription)
                .points(points)
                .isPublic(false)
                .rating(null)
                .createdAt(Instant.now())
                .lastUpdated(Instant.now())
                .build();

            when(routeService.createRoute(any(CreateRouteDto.class))).thenReturn(responseRouteDto);

            mockMvc.perform(post("/api/route")
                    .header("X-User-Id", userId)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(createRouteDto)))
                .andExpect(status().isCreated())
                .andExpect(status().is(201))
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id", is("route-id-123")))
                .andExpect(jsonPath("$.createdBy", is(userId)))
                .andExpect(jsonPath("$.name", is(routeName)))
                .andExpect(jsonPath("$.description", is(routeDescription)))
                .andExpect(jsonPath("$.isPublic", is(false)))
                .andExpect(jsonPath("$.points", notNullValue()))
                .andExpect(jsonPath("$.createdAt", notNullValue()))
                .andExpect(jsonPath("$.lastUpdated", notNullValue()));

            verify(routeService, times(1)).createRoute(argThat(dto ->
                dto.getCreatedBy().equals(userId) &&
                dto.getName().equals(routeName) &&
                dto.getDescription().equals(routeDescription) &&
                dto.getPoints().equals(points)
            ));
        }

        @Test
        @DisplayName("Should create public route successfully")
        void shouldCreatePublicRouteSuccessfully() throws Exception {
            String userId = "test-user-456";
            String routeName = "Public Route";
            List<Map<String, Object>> points = createSamplePoints();

            CreateRouteDto createRouteDto = CreateRouteDto.builder()
                .name(routeName)
                .points(points)
                .isPublic(true)
                .build();

            ResponseRouteDto responseRouteDto = ResponseRouteDto.builder()
                .id("public-route-id")
                .createdBy(userId)
                .name(routeName)
                .points(points)
                .isPublic(true)
                .createdAt(Instant.now())
                .lastUpdated(Instant.now())
                .build();

            when(routeService.createRoute(any(CreateRouteDto.class))).thenReturn(responseRouteDto);

            mockMvc.perform(post("/api/route")
                    .header("X-User-Id", userId)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(createRouteDto)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id", is("public-route-id")))
                .andExpect(jsonPath("$.isPublic", is(true)));

            verify(routeService, times(1)).createRoute(any(CreateRouteDto.class));
        }

        @Test
        @DisplayName("Should return 400 when X-User-Id header is missing")
        void shouldReturnBadRequestWhenUserIdHeaderMissing() throws Exception {
            CreateRouteDto createRouteDto = CreateRouteDto.builder()
                .name("Test Route")
                .points(createSamplePoints())
                .build();

            mockMvc.perform(post("/api/route")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(createRouteDto)))
                .andExpect(status().isBadRequest());

            verify(routeService, never()).createRoute(any());
        }

        @Test
        @DisplayName("Should return 400 when X-User-Id header is empty")
        void shouldReturnBadRequestWhenUserIdHeaderEmpty() throws Exception {
            CreateRouteDto createRouteDto = CreateRouteDto.builder()
                .name("Test Route")
                .points(createSamplePoints())
                .build();

            mockMvc.perform(post("/api/route")
                    .header("X-User-Id", "")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(createRouteDto)))
                .andExpect(status().isBadRequest());

            verify(routeService, never()).createRoute(any());
        }

        @Test
        @DisplayName("Should return 400 when name is missing")
        void shouldReturnBadRequestWhenNameMissing() throws Exception {
            String userId = "test-user-123";
            CreateRouteDto createRouteDto = CreateRouteDto.builder()
                .points(createSamplePoints())
                .build();

            mockMvc.perform(post("/api/route")
                    .header("X-User-Id", userId)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(createRouteDto)))
                .andExpect(status().isBadRequest());

            verify(routeService, never()).createRoute(any());
        }

        @Test
        @DisplayName("Should return 400 when points are missing")
        void shouldReturnBadRequestWhenPointsMissing() throws Exception {
            String userId = "test-user-123";
            CreateRouteDto createRouteDto = CreateRouteDto.builder()
                .name("Test Route")
                .build();

            mockMvc.perform(post("/api/route")
                    .header("X-User-Id", userId)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(createRouteDto)))
                .andExpect(status().isBadRequest());

            verify(routeService, never()).createRoute(any());
        }

        @Test
        @DisplayName("Should return 400 when name is too long")
        void shouldReturnBadRequestWhenNameTooLong() throws Exception {
            String userId = "test-user-123";
            String longName = "a".repeat(256); // Exceeds max 255
            CreateRouteDto createRouteDto = CreateRouteDto.builder()
                .name(longName)
                .points(createSamplePoints())
                .build();

            mockMvc.perform(post("/api/route")
                    .header("X-User-Id", userId)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(createRouteDto)))
                .andExpect(status().isBadRequest());

            verify(routeService, never()).createRoute(any());
        }

        @Test
        @DisplayName("Should return 400 when description is too long")
        void shouldReturnBadRequestWhenDescriptionTooLong() throws Exception {
            String userId = "test-user-123";
            String longDescription = "a".repeat(1001); // Exceeds max 1000
            CreateRouteDto createRouteDto = CreateRouteDto.builder()
                .name("Test Route")
                .description(longDescription)
                .points(createSamplePoints())
                .build();

            mockMvc.perform(post("/api/route")
                    .header("X-User-Id", userId)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(createRouteDto)))
                .andExpect(status().isBadRequest());

            verify(routeService, never()).createRoute(any());
        }

        @Test
        @DisplayName("Should verify that createdBy is set from header")
        void shouldSetCreatedByFromHeader() throws Exception {
            String userId = "header-user-id";
            CreateRouteDto createRouteDto = CreateRouteDto.builder()
                .name("Test Route")
                .points(createSamplePoints())
                .build();

            ResponseRouteDto responseRouteDto = ResponseRouteDto.builder()
                .id("route-id")
                .createdBy(userId)
                .name("Test Route")
                .points(createSamplePoints())
                .createdAt(Instant.now())
                .lastUpdated(Instant.now())
                .build();

            when(routeService.createRoute(any(CreateRouteDto.class))).thenReturn(responseRouteDto);

            mockMvc.perform(post("/api/route")
                    .header("X-User-Id", userId)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(createRouteDto)))
                .andExpect(status().isCreated());

            verify(routeService, times(1)).createRoute(argThat(dto ->
                dto.getCreatedBy() != null && dto.getCreatedBy().equals(userId)
            ));
        }
    }

    @Nested
    @DisplayName("GET /api/route/{routeId} - Get Route Tests")
    class GetRouteTests {

        @Test
        @DisplayName("Should get route successfully")
        void shouldGetRouteSuccessfully() throws Exception {
            String routeId = "route-123";
            List<Map<String, Object>> points = createSamplePoints();

            ResponseRouteDto responseRouteDto = ResponseRouteDto.builder()
                .id(routeId)
                .createdBy("user-123")
                .name("Test Route")
                .description("Route description")
                .points(points)
                .isPublic(true)
                .rating(4.5)
                .createdAt(Instant.now())
                .lastUpdated(Instant.now())
                .build();

            when(routeService.getRouteById(routeId)).thenReturn(responseRouteDto);

            mockMvc.perform(get("/api/route/{routeId}", routeId)
                    .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id", is(routeId)))
                .andExpect(jsonPath("$.name", is("Test Route")))
                .andExpect(jsonPath("$.description", is("Route description")))
                .andExpect(jsonPath("$.isPublic", is(true)))
                .andExpect(jsonPath("$.rating", is(4.5)))
                .andExpect(jsonPath("$.points", notNullValue()))
                .andExpect(jsonPath("$.createdAt", notNullValue()))
                .andExpect(jsonPath("$.lastUpdated", notNullValue()));

            verify(routeService, times(1)).getRouteById(routeId);
        }

        @Test
        @DisplayName("Should return 404 when route not found")
        void shouldReturnNotFoundWhenRouteNotExists() throws Exception {
            String routeId = "non-existent-route";

            when(routeService.getRouteById(routeId))
                .thenThrow(new RouteNotFoundException("Route " + routeId + " not found"));

            mockMvc.perform(get("/api/route/{routeId}", routeId)
                    .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status", is(404)))
                .andExpect(jsonPath("$.error", is("Not Found")))
                .andExpect(jsonPath("$.message", containsString("not found")));

            verify(routeService, times(1)).getRouteById(routeId);
        }

        @Test
        @DisplayName("Should handle different route IDs")
        void shouldHandleDifferentRouteIds() throws Exception {
            String routeId1 = "route-1";
            String routeId2 = "route-2";

            ResponseRouteDto route1 = ResponseRouteDto.builder()
                .id(routeId1)
                .name("Route 1")
                .points(createSamplePoints())
                .createdAt(Instant.now())
                .lastUpdated(Instant.now())
                .build();

            ResponseRouteDto route2 = ResponseRouteDto.builder()
                .id(routeId2)
                .name("Route 2")
                .points(createSamplePoints())
                .createdAt(Instant.now())
                .lastUpdated(Instant.now())
                .build();

            when(routeService.getRouteById(routeId1)).thenReturn(route1);
            when(routeService.getRouteById(routeId2)).thenReturn(route2);

            mockMvc.perform(get("/api/route/{routeId}", routeId1))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(routeId1)))
                .andExpect(jsonPath("$.name", is("Route 1")));

            mockMvc.perform(get("/api/route/{routeId}", routeId2))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(routeId2)))
                .andExpect(jsonPath("$.name", is("Route 2")));

            verify(routeService, times(1)).getRouteById(routeId1);
            verify(routeService, times(1)).getRouteById(routeId2);
        }
    }

    @Nested
    @DisplayName("GET /api/route/user/{userId} - Get Routes By User ID Tests")
    class GetRoutesByUserIdTests {

        @Test
        @DisplayName("Should get routes by user ID successfully")
        void shouldGetRoutesByUserIdSuccessfully() throws Exception {
            String userId = "user-123";
            List<Map<String, Object>> points1 = createSamplePoints();
            List<Map<String, Object>> points2 = createSamplePoints();

            ResponseRouteDto route1 = ResponseRouteDto.builder()
                .id("route-1")
                .createdBy(userId)
                .name("Route 1")
                .description("First route")
                .points(points1)
                .isPublic(true)
                .rating(4.5)
                .createdAt(Instant.now())
                .lastUpdated(Instant.now())
                .build();

            ResponseRouteDto route2 = ResponseRouteDto.builder()
                .id("route-2")
                .createdBy(userId)
                .name("Route 2")
                .description("Second route")
                .points(points2)
                .isPublic(false)
                .rating(3.0)
                .createdAt(Instant.now())
                .lastUpdated(Instant.now())
                .build();

            List<ResponseRouteDto> routes = List.of(route1, route2);

            when(routeService.getRoutesByUserId(userId)).thenReturn(routes);

            mockMvc.perform(get("/api/route/user/{userId}", userId)
                    .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].id", is("route-1")))
                .andExpect(jsonPath("$[0].createdBy", is(userId)))
                .andExpect(jsonPath("$[0].name", is("Route 1")))
                .andExpect(jsonPath("$[0].description", is("First route")))
                .andExpect(jsonPath("$[0].isPublic", is(true)))
                .andExpect(jsonPath("$[0].rating", is(4.5)))
                .andExpect(jsonPath("$[1].id", is("route-2")))
                .andExpect(jsonPath("$[1].createdBy", is(userId)))
                .andExpect(jsonPath("$[1].name", is("Route 2")))
                .andExpect(jsonPath("$[1].description", is("Second route")))
                .andExpect(jsonPath("$[1].isPublic", is(false)))
                .andExpect(jsonPath("$[1].rating", is(3.0)));

            verify(routeService, times(1)).getRoutesByUserId(userId);
        }

        @Test
        @DisplayName("Should return empty list when user has no routes")
        void shouldReturnEmptyListWhenUserHasNoRoutes() throws Exception {
            String userId = "user-with-no-routes";

            when(routeService.getRoutesByUserId(userId)).thenReturn(List.of());

            mockMvc.perform(get("/api/route/user/{userId}", userId)
                    .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$", hasSize(0)));

            verify(routeService, times(1)).getRoutesByUserId(userId);
        }

        @Test
        @DisplayName("Should return routes for different users independently")
        void shouldReturnRoutesForDifferentUsers() throws Exception {
            String userId1 = "user-1";
            String userId2 = "user-2";

            ResponseRouteDto route1 = ResponseRouteDto.builder()
                .id("route-1")
                .createdBy(userId1)
                .name("User 1 Route")
                .points(createSamplePoints())
                .createdAt(Instant.now())
                .lastUpdated(Instant.now())
                .build();

            ResponseRouteDto route2 = ResponseRouteDto.builder()
                .id("route-2")
                .createdBy(userId2)
                .name("User 2 Route")
                .points(createSamplePoints())
                .createdAt(Instant.now())
                .lastUpdated(Instant.now())
                .build();

            when(routeService.getRoutesByUserId(userId1)).thenReturn(List.of(route1));
            when(routeService.getRoutesByUserId(userId2)).thenReturn(List.of(route2));

            mockMvc.perform(get("/api/route/user/{userId}", userId1))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].id", is("route-1")))
                .andExpect(jsonPath("$[0].createdBy", is(userId1)));

            mockMvc.perform(get("/api/route/user/{userId}", userId2))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].id", is("route-2")))
                .andExpect(jsonPath("$[0].createdBy", is(userId2)));

            verify(routeService, times(1)).getRoutesByUserId(userId1);
            verify(routeService, times(1)).getRoutesByUserId(userId2);
        }

        @Test
        @DisplayName("Should return multiple routes for user with many routes")
        void shouldReturnMultipleRoutesForUser() throws Exception {
            String userId = "user-with-many-routes";
            List<ResponseRouteDto> routes = new ArrayList<>();
            
            for (int i = 1; i <= 5; i++) {
                ResponseRouteDto route = ResponseRouteDto.builder()
                    .id("route-" + i)
                    .createdBy(userId)
                    .name("Route " + i)
                    .points(createSamplePoints())
                    .createdAt(Instant.now())
                    .lastUpdated(Instant.now())
                    .build();
                routes.add(route);
            }

            when(routeService.getRoutesByUserId(userId)).thenReturn(routes);

            mockMvc.perform(get("/api/route/user/{userId}", userId)
                    .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(5)))
                .andExpect(jsonPath("$[0].id", is("route-1")))
                .andExpect(jsonPath("$[4].id", is("route-5")));

            verify(routeService, times(1)).getRoutesByUserId(userId);
        }
    }

    @Nested
    @DisplayName("PUT /api/route/{routeId} - Update Route Tests")
    class UpdateRouteTests {

        @Test
        @DisplayName("Should update route successfully with all fields")
        void shouldUpdateRouteSuccessfully() throws Exception {
            String userId = "user-123";
            String routeId = "route-123";
            List<Map<String, Object>> newPoints = createSamplePoints();

            UpdateRouteDto updateRouteDto = UpdateRouteDto.builder()
                .id(routeId) // Required for validation, will be overridden by controller
                .name("Updated Route Name")
                .description("Updated description")
                .points(newPoints)
                .isPublic(true)
                .rating(5.0)
                .build();

            ResponseRouteDto responseRouteDto = ResponseRouteDto.builder()
                .id(routeId)
                .createdBy(userId)
                .name("Updated Route Name")
                .description("Updated description")
                .points(newPoints)
                .isPublic(true)
                .rating(5.0)
                .createdAt(Instant.now())
                .lastUpdated(Instant.now())
                .build();

            when(routeService.updateRoute(any(UpdateRouteDto.class))).thenReturn(responseRouteDto);

            mockMvc.perform(put("/api/route/{routeId}", routeId)
                    .header("X-User-Id", userId)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(updateRouteDto)))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id", is(routeId)))
                .andExpect(jsonPath("$.name", is("Updated Route Name")))
                .andExpect(jsonPath("$.description", is("Updated description")))
                .andExpect(jsonPath("$.isPublic", is(true)))
                .andExpect(jsonPath("$.rating", is(5.0)));

            verify(routeService, times(1)).updateRoute(argThat(dto ->
                dto.getId().equals(routeId) &&
                dto.getName().equals("Updated Route Name") &&
                dto.getDescription().equals("Updated description")
            ));
        }

        @Test
        @DisplayName("Should update route with partial data (only name)")
        void shouldUpdateRoutePartially() throws Exception {
            String userId = "user-123";
            String routeId = "route-123";

            UpdateRouteDto updateRouteDto = UpdateRouteDto.builder()
                .id(routeId) // Required for validation, will be overridden by controller
                .name("New Name Only")
                .build();

            ResponseRouteDto responseRouteDto = ResponseRouteDto.builder()
                .id(routeId)
                .name("New Name Only")
                .createdAt(Instant.now())
                .lastUpdated(Instant.now())
                .build();

            when(routeService.updateRoute(any(UpdateRouteDto.class))).thenReturn(responseRouteDto);

            mockMvc.perform(put("/api/route/{routeId}", routeId)
                    .header("X-User-Id", userId)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(updateRouteDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(routeId)))
                .andExpect(jsonPath("$.name", is("New Name Only")));

            verify(routeService, times(1)).updateRoute(any(UpdateRouteDto.class));
        }

        @Test
        @DisplayName("Should return 404 when route not found")
        void shouldReturnNotFoundWhenRouteNotExists() throws Exception {
            String userId = "user-123";
            String routeId = "non-existent-route";

            UpdateRouteDto updateRouteDto = UpdateRouteDto.builder()
                .id(routeId) // Required for validation, will be overridden by controller
                .name("Updated Name")
                .build();

            when(routeService.updateRoute(any(UpdateRouteDto.class)))
                .thenThrow(new RouteNotFoundException("Route " + routeId + " not found"));

            mockMvc.perform(put("/api/route/{routeId}", routeId)
                    .header("X-User-Id", userId)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(updateRouteDto)))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status", is(404)))
                .andExpect(jsonPath("$.error", is("Not Found")))
                .andExpect(jsonPath("$.message", containsString("not found")));

            verify(routeService, times(1)).updateRoute(any(UpdateRouteDto.class));
        }

        @Test
        @DisplayName("Should return 400 when X-User-Id header is missing")
        void shouldReturnBadRequestWhenHeaderMissing() throws Exception {
            String routeId = "route-123";
            UpdateRouteDto updateRouteDto = UpdateRouteDto.builder()
                .id(routeId) // Required for validation
                .name("Updated Name")
                .build();

            mockMvc.perform(put("/api/route/{routeId}", routeId)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(updateRouteDto)))
                .andExpect(status().isBadRequest());

            verify(routeService, never()).updateRoute(any());
        }

        @Test
        @DisplayName("Should return 400 when X-User-Id header is empty")
        void shouldReturnBadRequestWhenHeaderEmpty() throws Exception {
            String routeId = "route-123";
            UpdateRouteDto updateRouteDto = UpdateRouteDto.builder()
                .id(routeId) // Required for validation
                .name("Updated Name")
                .build();

            mockMvc.perform(put("/api/route/{routeId}", routeId)
                    .header("X-User-Id", "")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(updateRouteDto)))
                .andExpect(status().isBadRequest());

            verify(routeService, never()).updateRoute(any());
        }

        @Test
        @DisplayName("Should verify that routeId from path is set in DTO")
        void shouldSetRouteIdFromPath() throws Exception {
            String userId = "user-123";
            String routeId = "path-route-id";
            String bodyRouteId = "wrong-route-id";

            UpdateRouteDto updateRouteDto = UpdateRouteDto.builder()
                .id(bodyRouteId) // This should be overridden
                .name("Updated Name")
                .build();

            ResponseRouteDto responseRouteDto = ResponseRouteDto.builder()
                .id(routeId)
                .name("Updated Name")
                .createdAt(Instant.now())
                .lastUpdated(Instant.now())
                .build();

            when(routeService.updateRoute(any(UpdateRouteDto.class))).thenReturn(responseRouteDto);

            mockMvc.perform(put("/api/route/{routeId}", routeId)
                    .header("X-User-Id", userId)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(updateRouteDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(routeId)));

            verify(routeService, times(1)).updateRoute(argThat(dto ->
                dto.getId().equals(routeId)
            ));
        }

        @Test
        @DisplayName("Should return 400 when name is too long")
        void shouldReturnBadRequestWhenNameTooLong() throws Exception {
            String userId = "user-123";
            String routeId = "route-123";
            String longName = "a".repeat(256); // Exceeds max 255

            UpdateRouteDto updateRouteDto = UpdateRouteDto.builder()
                .id(routeId) // Required for validation
                .name(longName)
                .build();

            mockMvc.perform(put("/api/route/{routeId}", routeId)
                    .header("X-User-Id", userId)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(updateRouteDto)))
                .andExpect(status().isBadRequest());

            verify(routeService, never()).updateRoute(any());
        }

        @Test
        @DisplayName("Should return 400 when description is too long")
        void shouldReturnBadRequestWhenDescriptionTooLong() throws Exception {
            String userId = "user-123";
            String routeId = "route-123";
            String longDescription = "a".repeat(1001); // Exceeds max 1000

            UpdateRouteDto updateRouteDto = UpdateRouteDto.builder()
                .id(routeId) // Required for validation
                .description(longDescription)
                .build();

            mockMvc.perform(put("/api/route/{routeId}", routeId)
                    .header("X-User-Id", userId)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(updateRouteDto)))
                .andExpect(status().isBadRequest());

            verify(routeService, never()).updateRoute(any());
        }
    }

    @Nested
    @DisplayName("DELETE /api/route/{routeId} - Delete Route Tests")
    class DeleteRouteTests {

        @Test
        @DisplayName("Should delete route successfully")
        void shouldDeleteRouteSuccessfully() throws Exception {
            String userId = "user-123";
            String routeId = "route-123";

            doNothing().when(routeService).deleteRouteById(routeId);

            mockMvc.perform(delete("/api/route/{routeId}", routeId)
                    .header("X-User-Id", userId))
                .andExpect(status().isNoContent())
                .andExpect(content().string(""));

            verify(routeService, times(1)).deleteRouteById(routeId);
        }

        @Test
        @DisplayName("Should return 404 when route not found")
        void shouldReturnNotFoundWhenRouteNotExists() throws Exception {
            String userId = "user-123";
            String routeId = "non-existent-route";

            doThrow(new RouteNotFoundException("Route " + routeId + " not found"))
                .when(routeService).deleteRouteById(routeId);

            mockMvc.perform(delete("/api/route/{routeId}", routeId)
                    .header("X-User-Id", userId))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status", is(404)))
                .andExpect(jsonPath("$.error", is("Not Found")))
                .andExpect(jsonPath("$.message", containsString("not found")));

            verify(routeService, times(1)).deleteRouteById(routeId);
        }

        @Test
        @DisplayName("Should return 400 when X-User-Id header is missing")
        void shouldReturnBadRequestWhenHeaderMissing() throws Exception {
            String routeId = "route-123";

            mockMvc.perform(delete("/api/route/{routeId}", routeId))
                .andExpect(status().isBadRequest());

            verify(routeService, never()).deleteRouteById(anyString());
        }

        @Test
        @DisplayName("Should return 400 when X-User-Id header is empty")
        void shouldReturnBadRequestWhenHeaderEmpty() throws Exception {
            String routeId = "route-123";

            mockMvc.perform(delete("/api/route/{routeId}", routeId)
                    .header("X-User-Id", ""))
                .andExpect(status().isBadRequest());

            verify(routeService, never()).deleteRouteById(anyString());
        }

        @Test
        @DisplayName("Should verify correct route is deleted")
        void shouldVerifyCorrectRouteDeleted() throws Exception {
            String userId = "user-123";
            String routeId = "specific-route-id";

            doNothing().when(routeService).deleteRouteById(routeId);

            mockMvc.perform(delete("/api/route/{routeId}", routeId)
                    .header("X-User-Id", userId))
                .andExpect(status().isNoContent());

            verify(routeService, times(1)).deleteRouteById(routeId);
            verify(routeService, never()).deleteRouteById("different-route-id");
        }

        @Test
        @DisplayName("Should handle multiple delete requests for different routes")
        void shouldHandleMultipleDeletes() throws Exception {
            String userId = "user-123";
            String routeId1 = "route-1";
            String routeId2 = "route-2";

            doNothing().when(routeService).deleteRouteById(anyString());

            mockMvc.perform(delete("/api/route/{routeId}", routeId1)
                    .header("X-User-Id", userId))
                .andExpect(status().isNoContent());

            mockMvc.perform(delete("/api/route/{routeId}", routeId2)
                    .header("X-User-Id", userId))
                .andExpect(status().isNoContent());

            verify(routeService, times(1)).deleteRouteById(routeId1);
            verify(routeService, times(1)).deleteRouteById(routeId2);
        }

        @Test
        @DisplayName("Should return proper HTTP 204 No Content status")
        void shouldReturnNoContentStatus() throws Exception {
            String userId = "user-123";
            String routeId = "route-123";

            doNothing().when(routeService).deleteRouteById(routeId);

            mockMvc.perform(delete("/api/route/{routeId}", routeId)
                    .header("X-User-Id", userId))
                .andExpect(status().isNoContent())
                .andExpect(status().is(204));

            verify(routeService, times(1)).deleteRouteById(routeId);
        }
    }
}


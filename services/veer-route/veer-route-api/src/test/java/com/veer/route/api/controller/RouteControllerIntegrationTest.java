package com.veer.route.api.controller;

import com.veer.route.api.exception.GlobalExceptionHandler;
import com.veer.route.model.Route;
import com.veer.route.repository.RouteRepository;
import com.veer.route.service.RouteServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.Instant;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.hamcrest.Matchers.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(RouteController.class)
@Import({RouteServiceImpl.class, GlobalExceptionHandler.class})
@DisplayName("RouteController Integration Tests")
class RouteControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private RouteRepository routeRepository;

    @BeforeEach
    void setUp() {
        reset(routeRepository);
    }

    @Nested
    @DisplayName("POST /api/route - Create Route Tests")
    class CreateRouteTests {

        @Test
        @DisplayName("Should create route successfully")
        void shouldCreateRouteSuccessfully() throws Exception {
            String routeId = "test-route-123";
            String userId = "user-123";
            String routeName = "Test Route";
            String routeDescription = "A test route description";

            List<Map<String, Object>> points = new ArrayList<>();
            Map<String, Object> point1 = new HashMap<>();
            point1.put("type", "Point");
            point1.put("coordinates", new double[]{52.2297, 21.0122});
            points.add(point1);

            String createRouteJson = """
                {
                    "id": "%s",
                    "points": [
                        {
                            "type": "Point",
                            "coordinates": [52.2297, 21.0122]
                        }
                    ],
                    "name": "%s",
                    "description": "%s",
                    "isPublic": false
                }
                """.formatted(routeId, routeName, routeDescription);

            when(routeRepository.findById(routeId)).thenReturn(Optional.empty());
            when(routeRepository.save(any(Route.class))).thenAnswer(invocation -> {
                Route route = invocation.getArgument(0);
                route.setCreatedAt(Instant.now());
                route.setLastUpdated(Instant.now());
                return route;
            });

            mockMvc.perform(post("/api/route")
                    .header("X-User-Id", userId)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(createRouteJson))
                .andExpect(status().isCreated())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id", is(routeId)))
                .andExpect(jsonPath("$.createdBy", is(userId)))
                .andExpect(jsonPath("$.name", is(routeName)))
                .andExpect(jsonPath("$.description", is(routeDescription)))
                .andExpect(jsonPath("$.isPublic", is(false)))
                .andExpect(jsonPath("$.points", notNullValue()))
                .andExpect(jsonPath("$.createdAt", notNullValue()))
                .andExpect(jsonPath("$.lastUpdated", notNullValue()));

            verify(routeRepository, times(1)).findById(routeId);
            verify(routeRepository, times(1)).save(any(Route.class));
        }

        @Test
        @DisplayName("Should handle RouteAlreadyExistsException when route already exists")
        void shouldHandleRouteAlreadyExistsException() throws Exception {
            String routeId = "existing-route-123";
            String userId = "user-123";

            Route existingRoute = Route.builder()
                .id(routeId)
                .createdBy(userId)
                .name("Existing Route")
                .points(new ArrayList<>())
                .isPublic(false)
                .build();

            String createRouteJson = """
                {
                    "id": "%s",
                    "points": [],
                    "name": "New Route",
                    "isPublic": false
                }
                """.formatted(routeId);

            when(routeRepository.findById(routeId)).thenReturn(Optional.of(existingRoute));

            mockMvc.perform(post("/api/route")
                    .header("X-User-Id", userId)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(createRouteJson))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.status", is(409)))
                .andExpect(jsonPath("$.error", is("Conflict")))
                .andExpect(jsonPath("$.message", containsString("already exists")));

            verify(routeRepository, times(1)).findById(routeId);
            verify(routeRepository, never()).save(any());
        }

        @Test
        @DisplayName("Should return 400 when X-User-Id header is missing")
        void shouldReturnBadRequestWhenUserIdHeaderMissing() throws Exception {
            String createRouteJson = """
                {
                    "id": "test-route",
                    "points": [],
                    "name": "Test Route",
                    "isPublic": false
                }
                """;

            mockMvc.perform(post("/api/route")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(createRouteJson))
                .andExpect(status().isBadRequest());

            verify(routeRepository, never()).save(any());
        }
    }

    @Nested
    @DisplayName("GET /api/route/{routeId} - Get Route Tests")
    class GetRouteTests {

        @Test
        @DisplayName("Should get route successfully")
        void shouldGetRouteSuccessfully() throws Exception {
            String routeId = "test-route-123";

            List<Map<String, Object>> points = new ArrayList<>();
            Map<String, Object> point1 = new HashMap<>();
            point1.put("type", "Point");
            point1.put("coordinates", new double[]{52.2297, 21.0122});
            points.add(point1);

            Route route = Route.builder()
                .id(routeId)
                .createdBy("user-123")
                .points(points)
                .name("Test Route")
                .description("Test description")
                .isPublic(true)
                .rating(4.5)
                .createdAt(Instant.now())
                .lastUpdated(Instant.now())
                .build();

            when(routeRepository.findById(routeId)).thenReturn(Optional.of(route));

            mockMvc.perform(get("/api/route/{routeId}", routeId)
                    .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id", is(routeId)))
                .andExpect(jsonPath("$.name", is("Test Route")))
                .andExpect(jsonPath("$.description", is("Test description")))
                .andExpect(jsonPath("$.isPublic", is(true)))
                .andExpect(jsonPath("$.rating", is(4.5)))
                .andExpect(jsonPath("$.points", notNullValue()));

            verify(routeRepository, times(1)).findById(routeId);
        }

        @Test
        @DisplayName("Should return 404 when route not found")
        void shouldReturnNotFoundWhenRouteNotExists() throws Exception {
            String routeId = "non-existent-route";

            when(routeRepository.findById(routeId)).thenReturn(Optional.empty());

            mockMvc.perform(get("/api/route/{routeId}", routeId)
                    .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status", is(404)))
                .andExpect(jsonPath("$.error", is("Not Found")))
                .andExpect(jsonPath("$.message", containsString("not found")));

            verify(routeRepository, times(1)).findById(routeId);
        }
    }

    @Nested
    @DisplayName("PUT /api/route/{routeId} - Update Route Tests")
    class UpdateRouteTests {

        @Test
        @DisplayName("Should update route successfully")
        void shouldUpdateRouteSuccessfully() throws Exception {
            String routeId = "test-route-123";
            String userId = "user-123";

            Route existingRoute = Route.builder()
                .id(routeId)
                .createdBy(userId)
                .name("Old Name")
                .description("Old description")
                .points(new ArrayList<>())
                .isPublic(false)
                .build();

            String updateRouteJson = """
                {
                    "name": "Updated Name",
                    "description": "Updated description",
                    "isPublic": true,
                    "rating": 4.5
                }
                """;

            when(routeRepository.findById(routeId)).thenReturn(Optional.of(existingRoute));
            when(routeRepository.save(any(Route.class))).thenAnswer(invocation -> {
                Route route = invocation.getArgument(0);
                route.setLastUpdated(Instant.now());
                return route;
            });

            mockMvc.perform(put("/api/route/{routeId}", routeId)
                    .header("X-User-Id", userId)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(updateRouteJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name", is("Updated Name")))
                .andExpect(jsonPath("$.description", is("Updated description")))
                .andExpect(jsonPath("$.isPublic", is(true)))
                .andExpect(jsonPath("$.rating", is(4.5)));

            verify(routeRepository, times(1)).findById(routeId);
            verify(routeRepository, times(1)).save(any(Route.class));
        }

        @Test
        @DisplayName("Should return 404 when route not found for update")
        void shouldReturnNotFoundWhenRouteNotExistsForUpdate() throws Exception {
            String routeId = "non-existent-route";
            String userId = "user-123";

            String updateRouteJson = """
                {
                    "name": "Updated Name"
                }
                """;

            when(routeRepository.findById(routeId)).thenReturn(Optional.empty());

            mockMvc.perform(put("/api/route/{routeId}", routeId)
                    .header("X-User-Id", userId)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(updateRouteJson))
                .andExpect(status().isNotFound());

            verify(routeRepository, times(1)).findById(routeId);
            verify(routeRepository, never()).save(any());
        }
    }

    @Nested
    @DisplayName("DELETE /api/route/{routeId} - Delete Route Tests")
    class DeleteRouteTests {

        @Test
        @DisplayName("Should delete route successfully")
        void shouldDeleteRouteSuccessfully() throws Exception {
            String routeId = "test-route-123";
            String userId = "user-123";

            Route route = Route.builder()
                .id(routeId)
                .createdBy(userId)
                .name("Test Route")
                .points(new ArrayList<>())
                .isPublic(false)
                .build();

            when(routeRepository.findById(routeId)).thenReturn(Optional.of(route));
            doNothing().when(routeRepository).delete(route);

            mockMvc.perform(delete("/api/route/{routeId}", routeId)
                    .header("X-User-Id", userId)
                    .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNoContent());

            verify(routeRepository, times(1)).findById(routeId);
            verify(routeRepository, times(1)).delete(route);
        }

        @Test
        @DisplayName("Should return 404 when route not found for delete")
        void shouldReturnNotFoundWhenRouteNotExistsForDelete() throws Exception {
            String routeId = "non-existent-route";
            String userId = "user-123";

            when(routeRepository.findById(routeId)).thenReturn(Optional.empty());

            mockMvc.perform(delete("/api/route/{routeId}", routeId)
                    .header("X-User-Id", userId)
                    .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound());

            verify(routeRepository, times(1)).findById(routeId);
            verify(routeRepository, never()).delete(any());
        }
    }
}


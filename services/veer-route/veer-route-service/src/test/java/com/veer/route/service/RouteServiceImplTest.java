package com.veer.route.service;

import com.veer.route.model.Route;
import com.veer.route.model.dto.CreateRouteDto;
import com.veer.route.model.dto.ResponseRouteDto;
import com.veer.route.model.dto.UpdateRouteDto;
import com.veer.route.model.exception.RouteNotFoundException;
import com.veer.route.repository.RouteRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.Instant;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("RouteServiceImpl Unit Tests")
class RouteServiceImplTest {

    @Mock
    private RouteRepository repository;

    @InjectMocks
    private RouteServiceImpl routeService;

    private List<Map<String, Object>> samplePoints;

    @BeforeEach
    void setUp() {
        samplePoints = createSamplePoints();
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
    @DisplayName("createRoute Tests")
    class CreateRouteTests {

        @Test
        @DisplayName("Should create route successfully")
        void shouldCreateRouteSuccessfully() {
            // Given
            String userId = "user-123";
            CreateRouteDto createRouteDto = CreateRouteDto.builder()
                .createdBy(userId)
                .name("Test Route")
                .description("Test Description")
                .points(samplePoints)
                .isPublic(false)
                .build();

            Route savedRoute = Route.builder()
                .id("route-id-123")
                .createdBy(userId)
                .name("Test Route")
                .description("Test Description")
                .points(samplePoints)
                .isPublic(false)
                .createdAt(Instant.now())
                .lastUpdated(Instant.now())
                .build();

            when(repository.save(any(Route.class))).thenReturn(savedRoute);

            // When
            ResponseRouteDto result = routeService.createRoute(createRouteDto);

            // Then
            assertThat(result).isNotNull();
            assertThat(result.getId()).isEqualTo("route-id-123");
            assertThat(result.getCreatedBy()).isEqualTo(userId);
            assertThat(result.getName()).isEqualTo("Test Route");
            assertThat(result.getDescription()).isEqualTo("Test Description");
            assertThat(result.getPoints()).isEqualTo(samplePoints);
            assertThat(result.getIsPublic()).isFalse();
            assertThat(result.getCreatedAt()).isNotNull();
            assertThat(result.getLastUpdated()).isNotNull();

            verify(repository, times(1)).save(any(Route.class));
        }

        @Test
        @DisplayName("Should create public route successfully")
        void shouldCreatePublicRouteSuccessfully() {
            // Given
            String userId = "user-456";
            CreateRouteDto createRouteDto = CreateRouteDto.builder()
                .createdBy(userId)
                .name("Public Route")
                .points(samplePoints)
                .isPublic(true)
                .build();

            Route savedRoute = Route.builder()
                .id("public-route-id")
                .createdBy(userId)
                .name("Public Route")
                .points(samplePoints)
                .isPublic(true)
                .createdAt(Instant.now())
                .lastUpdated(Instant.now())
                .build();

            when(repository.save(any(Route.class))).thenReturn(savedRoute);

            // When
            ResponseRouteDto result = routeService.createRoute(createRouteDto);

            // Then
            assertThat(result).isNotNull();
            assertThat(result.getIsPublic()).isTrue();
            verify(repository, times(1)).save(any(Route.class));
        }

        @Test
        @DisplayName("Should create route with default isPublic value")
        void shouldCreateRouteWithDefaultIsPublic() {
            // Given
            CreateRouteDto createRouteDto = CreateRouteDto.builder()
                .createdBy("user-123")
                .name("Test Route")
                .points(samplePoints)
                .build(); // isPublic not set, should default to false

            Route savedRoute = Route.builder()
                .id("route-id")
                .createdBy("user-123")
                .name("Test Route")
                .points(samplePoints)
                .isPublic(false)
                .createdAt(Instant.now())
                .lastUpdated(Instant.now())
                .build();

            when(repository.save(any(Route.class))).thenReturn(savedRoute);

            // When
            ResponseRouteDto result = routeService.createRoute(createRouteDto);

            // Then
            assertThat(result).isNotNull();
            verify(repository, times(1)).save(any(Route.class));
        }
    }

    @Nested
    @DisplayName("getRouteById Tests")
    class GetRouteByIdTests {

        @Test
        @DisplayName("Should get route by id successfully")
        void shouldGetRouteByIdSuccessfully() {
            // Given
            String routeId = "route-123";
            Route route = Route.builder()
                .id(routeId)
                .createdBy("user-123")
                .name("Test Route")
                .description("Test Description")
                .points(samplePoints)
                .isPublic(true)
                .rating(4.5)
                .createdAt(Instant.now())
                .lastUpdated(Instant.now())
                .build();

            when(repository.findById(routeId)).thenReturn(Optional.of(route));

            // When
            ResponseRouteDto result = routeService.getRouteById(routeId);

            // Then
            assertThat(result).isNotNull();
            assertThat(result.getId()).isEqualTo(routeId);
            assertThat(result.getName()).isEqualTo("Test Route");
            assertThat(result.getDescription()).isEqualTo("Test Description");
            assertThat(result.getRating()).isEqualTo(4.5);
            assertThat(result.getIsPublic()).isTrue();

            verify(repository, times(1)).findById(routeId);
        }

        @Test
        @DisplayName("Should throw RouteNotFoundException when route not found")
        void shouldThrowRouteNotFoundExceptionWhenRouteNotFound() {
            // Given
            String routeId = "non-existent-route";
            when(repository.findById(routeId)).thenReturn(Optional.empty());

            // When/Then
            assertThatThrownBy(() -> routeService.getRouteById(routeId))
                .isInstanceOf(RouteNotFoundException.class)
                .hasMessageContaining("Route " + routeId + " not found");

            verify(repository, times(1)).findById(routeId);
        }
    }

    @Nested
    @DisplayName("deleteRouteById Tests")
    class DeleteRouteByIdTests {

        @Test
        @DisplayName("Should delete route successfully")
        void shouldDeleteRouteSuccessfully() {
            // Given
            String routeId = "route-123";
            Route route = Route.builder()
                .id(routeId)
                .createdBy("user-123")
                .name("Test Route")
                .points(samplePoints)
                .build();

            when(repository.findById(routeId)).thenReturn(Optional.of(route));
            doNothing().when(repository).delete(route);

            // When
            routeService.deleteRouteById(routeId);

            // Then
            verify(repository, times(1)).findById(routeId);
            verify(repository, times(1)).delete(route);
        }

        @Test
        @DisplayName("Should throw RouteNotFoundException when route not found")
        void shouldThrowRouteNotFoundExceptionWhenRouteNotFound() {
            // Given
            String routeId = "non-existent-route";
            when(repository.findById(routeId)).thenReturn(Optional.empty());

            // When/Then
            assertThatThrownBy(() -> routeService.deleteRouteById(routeId))
                .isInstanceOf(RouteNotFoundException.class)
                .hasMessageContaining("Route " + routeId + " not found");

            verify(repository, times(1)).findById(routeId);
            verify(repository, never()).delete(any(Route.class));
        }
    }

    @Nested
    @DisplayName("updateRoute Tests")
    class UpdateRouteTests {

        @Test
        @DisplayName("Should update route with all fields")
        void shouldUpdateRouteWithAllFields() {
            // Given
            String routeId = "route-123";
            Route existingRoute = Route.builder()
                .id(routeId)
                .createdBy("user-123")
                .name("Old Name")
                .description("Old Description")
                .points(samplePoints)
                .isPublic(false)
                .rating(3.0)
                .createdAt(Instant.now())
                .lastUpdated(Instant.now())
                .build();

            List<Map<String, Object>> newPoints = createSamplePoints();
            UpdateRouteDto updateRouteDto = UpdateRouteDto.builder()
                .id(routeId)
                .name("New Name")
                .description("New Description")
                .points(newPoints)
                .isPublic(true)
                .rating(5.0)
                .build();

            when(repository.findById(routeId)).thenReturn(Optional.of(existingRoute));
            when(repository.save(any(Route.class))).thenAnswer(invocation -> invocation.getArgument(0));

            // When
            ResponseRouteDto result = routeService.updateRoute(updateRouteDto);

            // Then
            assertThat(result).isNotNull();
            assertThat(result.getId()).isEqualTo(routeId);
            assertThat(result.getName()).isEqualTo("New Name");
            assertThat(result.getDescription()).isEqualTo("New Description");
            assertThat(result.getPoints()).isEqualTo(newPoints);
            assertThat(result.getIsPublic()).isTrue();
            assertThat(result.getRating()).isEqualTo(5.0);

            verify(repository, times(1)).findById(routeId);
            verify(repository, times(1)).save(any(Route.class));
        }

        @Test
        @DisplayName("Should update route partially - only name")
        void shouldUpdateRoutePartiallyOnlyName() {
            // Given
            String routeId = "route-123";
            Route existingRoute = Route.builder()
                .id(routeId)
                .createdBy("user-123")
                .name("Old Name")
                .description("Old Description")
                .points(samplePoints)
                .isPublic(false)
                .rating(3.0)
                .createdAt(Instant.now())
                .lastUpdated(Instant.now())
                .build();

            UpdateRouteDto updateRouteDto = UpdateRouteDto.builder()
                .id(routeId)
                .name("New Name")
                .build();

            when(repository.findById(routeId)).thenReturn(Optional.of(existingRoute));
            when(repository.save(any(Route.class))).thenAnswer(invocation -> invocation.getArgument(0));

            // When
            ResponseRouteDto result = routeService.updateRoute(updateRouteDto);

            // Then
            assertThat(result).isNotNull();
            assertThat(result.getName()).isEqualTo("New Name");
            assertThat(result.getDescription()).isEqualTo("Old Description"); // Unchanged
            assertThat(result.getIsPublic()).isFalse(); // Unchanged
            assertThat(result.getRating()).isEqualTo(3.0); // Unchanged

            verify(repository, times(1)).findById(routeId);
            verify(repository, times(1)).save(any(Route.class));
        }

        @Test
        @DisplayName("Should update route partially - only rating")
        void shouldUpdateRoutePartiallyOnlyRating() {
            // Given
            String routeId = "route-123";
            Route existingRoute = Route.builder()
                .id(routeId)
                .createdBy("user-123")
                .name("Test Route")
                .points(samplePoints)
                .rating(3.0)
                .createdAt(Instant.now())
                .lastUpdated(Instant.now())
                .build();

            UpdateRouteDto updateRouteDto = UpdateRouteDto.builder()
                .id(routeId)
                .rating(4.5)
                .build();

            when(repository.findById(routeId)).thenReturn(Optional.of(existingRoute));
            when(repository.save(any(Route.class))).thenAnswer(invocation -> invocation.getArgument(0));

            // When
            ResponseRouteDto result = routeService.updateRoute(updateRouteDto);

            // Then
            assertThat(result).isNotNull();
            assertThat(result.getRating()).isEqualTo(4.5);
            assertThat(result.getName()).isEqualTo("Test Route"); // Unchanged

            verify(repository, times(1)).findById(routeId);
            verify(repository, times(1)).save(any(Route.class));
        }

        @Test
        @DisplayName("Should not update fields when null values provided")
        void shouldNotUpdateFieldsWhenNullValuesProvided() {
            // Given
            String routeId = "route-123";
            Route existingRoute = Route.builder()
                .id(routeId)
                .createdBy("user-123")
                .name("Original Name")
                .description("Original Description")
                .points(samplePoints)
                .isPublic(false)
                .rating(3.0)
                .createdAt(Instant.now())
                .lastUpdated(Instant.now())
                .build();

            UpdateRouteDto updateRouteDto = UpdateRouteDto.builder()
                .id(routeId)
                .build(); // All fields null

            when(repository.findById(routeId)).thenReturn(Optional.of(existingRoute));
            when(repository.save(any(Route.class))).thenAnswer(invocation -> invocation.getArgument(0));

            // When
            ResponseRouteDto result = routeService.updateRoute(updateRouteDto);

            // Then
            assertThat(result).isNotNull();
            assertThat(result.getName()).isEqualTo("Original Name");
            assertThat(result.getDescription()).isEqualTo("Original Description");
            assertThat(result.getIsPublic()).isFalse();
            assertThat(result.getRating()).isEqualTo(3.0);

            verify(repository, times(1)).findById(routeId);
            verify(repository, times(1)).save(any(Route.class));
        }

        @Test
        @DisplayName("Should throw RouteNotFoundException when route not found")
        void shouldThrowRouteNotFoundExceptionWhenRouteNotFound() {
            // Given
            String routeId = "non-existent-route";
            UpdateRouteDto updateRouteDto = UpdateRouteDto.builder()
                .id(routeId)
                .name("New Name")
                .build();

            when(repository.findById(routeId)).thenReturn(Optional.empty());

            // When/Then
            assertThatThrownBy(() -> routeService.updateRoute(updateRouteDto))
                .isInstanceOf(RouteNotFoundException.class)
                .hasMessageContaining("Route " + routeId + " not found");

            verify(repository, times(1)).findById(routeId);
            verify(repository, never()).save(any(Route.class));
        }
    }

    @Nested
    @DisplayName("getRoutesByUserId Tests")
    class GetRoutesByUserIdTests {

        @Test
        @DisplayName("Should get routes by user id successfully")
        void shouldGetRoutesByUserIdSuccessfully() {
            // Given
            String userId = "user-123";
            Route route1 = Route.builder()
                .id("route-1")
                .createdBy(userId)
                .name("Route 1")
                .points(samplePoints)
                .isPublic(true)
                .rating(4.5)
                .createdAt(Instant.now())
                .lastUpdated(Instant.now())
                .build();

            Route route2 = Route.builder()
                .id("route-2")
                .createdBy(userId)
                .name("Route 2")
                .points(samplePoints)
                .isPublic(false)
                .rating(3.0)
                .createdAt(Instant.now())
                .lastUpdated(Instant.now())
                .build();

            List<Route> routes = List.of(route1, route2);
            when(repository.findByCreatedBy(userId)).thenReturn(routes);

            // When
            List<ResponseRouteDto> result = routeService.getRoutesByUserId(userId);

            // Then
            assertThat(result).isNotNull();
            assertThat(result).hasSize(2);
            assertThat(result.get(0).getId()).isEqualTo("route-1");
            assertThat(result.get(0).getCreatedBy()).isEqualTo(userId);
            assertThat(result.get(0).getRating()).isEqualTo(4.5);
            assertThat(result.get(1).getId()).isEqualTo("route-2");
            assertThat(result.get(1).getCreatedBy()).isEqualTo(userId);
            assertThat(result.get(1).getRating()).isEqualTo(3.0);

            verify(repository, times(1)).findByCreatedBy(userId);
        }

        @Test
        @DisplayName("Should return empty list when user has no routes")
        void shouldReturnEmptyListWhenUserHasNoRoutes() {
            // Given
            String userId = "user-with-no-routes";
            when(repository.findByCreatedBy(userId)).thenReturn(List.of());

            // When
            List<ResponseRouteDto> result = routeService.getRoutesByUserId(userId);

            // Then
            assertThat(result).isNotNull();
            assertThat(result).isEmpty();

            verify(repository, times(1)).findByCreatedBy(userId);
        }

        @Test
        @DisplayName("Should return routes only for specified user")
        void shouldReturnRoutesOnlyForSpecifiedUser() {
            // Given
            String userId1 = "user-1";
            String userId2 = "user-2";

            Route route1 = Route.builder()
                .id("route-1")
                .createdBy(userId1)
                .name("User 1 Route")
                .points(samplePoints)
                .createdAt(Instant.now())
                .lastUpdated(Instant.now())
                .build();

            Route route2 = Route.builder()
                .id("route-2")
                .createdBy(userId2)
                .name("User 2 Route")
                .points(samplePoints)
                .createdAt(Instant.now())
                .lastUpdated(Instant.now())
                .build();

            when(repository.findByCreatedBy(userId1)).thenReturn(List.of(route1));
            when(repository.findByCreatedBy(userId2)).thenReturn(List.of(route2));

            // When
            List<ResponseRouteDto> result1 = routeService.getRoutesByUserId(userId1);
            List<ResponseRouteDto> result2 = routeService.getRoutesByUserId(userId2);

            // Then
            assertThat(result1).hasSize(1);
            assertThat(result1.get(0).getCreatedBy()).isEqualTo(userId1);
            assertThat(result2).hasSize(1);
            assertThat(result2.get(0).getCreatedBy()).isEqualTo(userId2);

            verify(repository, times(1)).findByCreatedBy(userId1);
            verify(repository, times(1)).findByCreatedBy(userId2);
        }
    }
}


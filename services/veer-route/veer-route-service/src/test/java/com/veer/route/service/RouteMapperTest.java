package com.veer.route.service;

import com.veer.route.model.Route;
import com.veer.route.model.dto.CreateRouteDto;
import com.veer.route.model.dto.ResponseRouteDto;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;

import java.time.Instant;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

@DisplayName("RouteMapper Unit Tests")
class RouteMapperTest {

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
    @DisplayName("toEntity Tests")
    class ToEntityTests {

        @Test
        @DisplayName("Should map CreateRouteDto to Route entity with all fields")
        void shouldMapCreateRouteDtoToEntityWithAllFields() {
            // Given
            String userId = "user-123";
            CreateRouteDto createRouteDto = CreateRouteDto.builder()
                .createdBy(userId)
                .name("Test Route")
                .description("Test Description")
                .points(samplePoints)
                .isPublic(true)
                .build();

            // When
            Route route = RouteMapper.toEntity(createRouteDto);

            // Then
            assertThat(route).isNotNull();
            assertThat(route.getId()).isNotNull();
            assertThat(route.getId()).isNotEmpty();
            assertThat(route.getCreatedBy()).isEqualTo(userId);
            assertThat(route.getName()).isEqualTo("Test Route");
            assertThat(route.getDescription()).isEqualTo("Test Description");
            assertThat(route.getPoints()).isEqualTo(samplePoints);
            assertThat(route.getIsPublic()).isTrue();
            assertThat(route.getRating()).isNull();
            assertThat(route.getCreatedAt()).isNull();
            assertThat(route.getLastUpdated()).isNull();
        }

        @Test
        @DisplayName("Should generate unique UUID for each route")
        void shouldGenerateUniqueUuidForEachRoute() {
            // Given
            CreateRouteDto createRouteDto1 = CreateRouteDto.builder()
                .createdBy("user-1")
                .name("Route 1")
                .points(samplePoints)
                .build();

            CreateRouteDto createRouteDto2 = CreateRouteDto.builder()
                .createdBy("user-2")
                .name("Route 2")
                .points(samplePoints)
                .build();

            // When
            Route route1 = RouteMapper.toEntity(createRouteDto1);
            Route route2 = RouteMapper.toEntity(createRouteDto2);

            // Then
            assertThat(route1.getId()).isNotEqualTo(route2.getId());
            assertThat(route1.getId()).isNotEmpty();
            assertThat(route2.getId()).isNotEmpty();
        }

        @Test
        @DisplayName("Should map CreateRouteDto with default isPublic value")
        void shouldMapCreateRouteDtoWithDefaultIsPublic() {
            // Given
            CreateRouteDto createRouteDto = CreateRouteDto.builder()
                .createdBy("user-123")
                .name("Test Route")
                .points(samplePoints)
                .build(); // isPublic not set

            // When
            Route route = RouteMapper.toEntity(createRouteDto);

            // Then
            assertThat(route).isNotNull();
            assertThat(route.getIsPublic()).isFalse(); // Default value
        }

        @Test
        @DisplayName("Should map CreateRouteDto with null description")
        void shouldMapCreateRouteDtoWithNullDescription() {
            // Given
            CreateRouteDto createRouteDto = CreateRouteDto.builder()
                .createdBy("user-123")
                .name("Test Route")
                .points(samplePoints)
                .description(null)
                .build();

            // When
            Route route = RouteMapper.toEntity(createRouteDto);

            // Then
            assertThat(route).isNotNull();
            assertThat(route.getDescription()).isNull();
        }

        @Test
        @DisplayName("Should map CreateRouteDto with empty points list")
        void shouldMapCreateRouteDtoWithEmptyPointsList() {
            // Given
            CreateRouteDto createRouteDto = CreateRouteDto.builder()
                .createdBy("user-123")
                .name("Test Route")
                .points(new ArrayList<>())
                .build();

            // When
            Route route = RouteMapper.toEntity(createRouteDto);

            // Then
            assertThat(route).isNotNull();
            assertThat(route.getPoints()).isNotNull();
            assertThat(route.getPoints()).isEmpty();
        }

        @Test
        @DisplayName("Should map CreateRouteDto with complex points structure")
        void shouldMapCreateRouteDtoWithComplexPointsStructure() {
            // Given
            List<Map<String, Object>> complexPoints = new ArrayList<>();
            Map<String, Object> point1 = new HashMap<>();
            point1.put("latitude", 52.2297);
            point1.put("longitude", 21.0122);
            point1.put("altitude", 100.0);
            point1.put("timestamp", "2024-01-01T10:00:00Z");
            complexPoints.add(point1);

            CreateRouteDto createRouteDto = CreateRouteDto.builder()
                .createdBy("user-123")
                .name("Test Route")
                .points(complexPoints)
                .build();

            // When
            Route route = RouteMapper.toEntity(createRouteDto);

            // Then
            assertThat(route).isNotNull();
            assertThat(route.getPoints()).isEqualTo(complexPoints);
            assertThat(route.getPoints().get(0)).containsKey("latitude");
            assertThat(route.getPoints().get(0)).containsKey("longitude");
            assertThat(route.getPoints().get(0)).containsKey("altitude");
            assertThat(route.getPoints().get(0)).containsKey("timestamp");
        }
    }

    @Nested
    @DisplayName("toResponseRouteDto Tests")
    class ToResponseRouteDtoTests {

        @Test
        @DisplayName("Should map Route to ResponseRouteDto with all fields")
        void shouldMapRouteToResponseRouteDtoWithAllFields() {
            // Given
            String routeId = UUID.randomUUID().toString();
            Instant createdAt = Instant.now();
            Instant lastUpdated = Instant.now();

            Route route = Route.builder()
                .id(routeId)
                .createdBy("user-123")
                .name("Test Route")
                .description("Test Description")
                .points(samplePoints)
                .isPublic(true)
                .rating(4.5)
                .createdAt(createdAt)
                .lastUpdated(lastUpdated)
                .build();

            // When
            ResponseRouteDto responseRouteDto = RouteMapper.toResponseRouteDto(route);

            // Then
            assertThat(responseRouteDto).isNotNull();
            assertThat(responseRouteDto.getId()).isEqualTo(routeId);
            assertThat(responseRouteDto.getCreatedBy()).isEqualTo("user-123");
            assertThat(responseRouteDto.getName()).isEqualTo("Test Route");
            assertThat(responseRouteDto.getDescription()).isEqualTo("Test Description");
            assertThat(responseRouteDto.getPoints()).isEqualTo(samplePoints);
            assertThat(responseRouteDto.getIsPublic()).isTrue();
            assertThat(responseRouteDto.getRating()).isEqualTo(4.5);
            assertThat(responseRouteDto.getCreatedAt()).isEqualTo(createdAt);
            assertThat(responseRouteDto.getLastUpdated()).isEqualTo(lastUpdated);
        }

        @Test
        @DisplayName("Should map Route with null rating")
        void shouldMapRouteWithNullRating() {
            // Given
            Route route = Route.builder()
                .id(UUID.randomUUID().toString())
                .createdBy("user-123")
                .name("Test Route")
                .points(samplePoints)
                .rating(null)
                .createdAt(Instant.now())
                .lastUpdated(Instant.now())
                .build();

            // When
            ResponseRouteDto responseRouteDto = RouteMapper.toResponseRouteDto(route);

            // Then
            assertThat(responseRouteDto).isNotNull();
            assertThat(responseRouteDto.getRating()).isNull();
        }

        @Test
        @DisplayName("Should map Route with null description")
        void shouldMapRouteWithNullDescription() {
            // Given
            Route route = Route.builder()
                .id(UUID.randomUUID().toString())
                .createdBy("user-123")
                .name("Test Route")
                .description(null)
                .points(samplePoints)
                .createdAt(Instant.now())
                .lastUpdated(Instant.now())
                .build();

            // When
            ResponseRouteDto responseRouteDto = RouteMapper.toResponseRouteDto(route);

            // Then
            assertThat(responseRouteDto).isNotNull();
            assertThat(responseRouteDto.getDescription()).isNull();
        }

        @Test
        @DisplayName("Should map Route with false isPublic")
        void shouldMapRouteWithFalseIsPublic() {
            // Given
            Route route = Route.builder()
                .id(UUID.randomUUID().toString())
                .createdBy("user-123")
                .name("Test Route")
                .points(samplePoints)
                .isPublic(false)
                .createdAt(Instant.now())
                .lastUpdated(Instant.now())
                .build();

            // When
            ResponseRouteDto responseRouteDto = RouteMapper.toResponseRouteDto(route);

            // Then
            assertThat(responseRouteDto).isNotNull();
            assertThat(responseRouteDto.getIsPublic()).isFalse();
        }

        @Test
        @DisplayName("Should map Route with zero rating")
        void shouldMapRouteWithZeroRating() {
            // Given
            Route route = Route.builder()
                .id(UUID.randomUUID().toString())
                .createdBy("user-123")
                .name("Test Route")
                .points(samplePoints)
                .rating(0.0)
                .createdAt(Instant.now())
                .lastUpdated(Instant.now())
                .build();

            // When
            ResponseRouteDto responseRouteDto = RouteMapper.toResponseRouteDto(route);

            // Then
            assertThat(responseRouteDto).isNotNull();
            assertThat(responseRouteDto.getRating()).isEqualTo(0.0);
        }

        @Test
        @DisplayName("Should map Route with maximum rating")
        void shouldMapRouteWithMaximumRating() {
            // Given
            Route route = Route.builder()
                .id(UUID.randomUUID().toString())
                .createdBy("user-123")
                .name("Test Route")
                .points(samplePoints)
                .rating(5.0)
                .createdAt(Instant.now())
                .lastUpdated(Instant.now())
                .build();

            // When
            ResponseRouteDto responseRouteDto = RouteMapper.toResponseRouteDto(route);

            // Then
            assertThat(responseRouteDto).isNotNull();
            assertThat(responseRouteDto.getRating()).isEqualTo(5.0);
        }

        @Test
        @DisplayName("Should preserve timestamps correctly")
        void shouldPreserveTimestampsCorrectly() {
            // Given
            Instant createdAt = Instant.parse("2024-01-01T10:00:00Z");
            Instant lastUpdated = Instant.parse("2024-01-02T15:30:00Z");

            Route route = Route.builder()
                .id(UUID.randomUUID().toString())
                .createdBy("user-123")
                .name("Test Route")
                .points(samplePoints)
                .createdAt(createdAt)
                .lastUpdated(lastUpdated)
                .build();

            // When
            ResponseRouteDto responseRouteDto = RouteMapper.toResponseRouteDto(route);

            // Then
            assertThat(responseRouteDto).isNotNull();
            assertThat(responseRouteDto.getCreatedAt()).isEqualTo(createdAt);
            assertThat(responseRouteDto.getLastUpdated()).isEqualTo(lastUpdated);
        }

        @Test
        @DisplayName("Should map Route with empty points list")
        void shouldMapRouteWithEmptyPointsList() {
            // Given
            Route route = Route.builder()
                .id(UUID.randomUUID().toString())
                .createdBy("user-123")
                .name("Test Route")
                .points(new ArrayList<>())
                .createdAt(Instant.now())
                .lastUpdated(Instant.now())
                .build();

            // When
            ResponseRouteDto responseRouteDto = RouteMapper.toResponseRouteDto(route);

            // Then
            assertThat(responseRouteDto).isNotNull();
            assertThat(responseRouteDto.getPoints()).isNotNull();
            assertThat(responseRouteDto.getPoints()).isEmpty();
        }
    }

    @Nested
    @DisplayName("Round-trip Mapping Tests")
    class RoundTripMappingTests {

        @Test
        @DisplayName("Should maintain data integrity in round-trip mapping")
        void shouldMaintainDataIntegrityInRoundTripMapping() {
            // Given
            String userId = "user-123";
            CreateRouteDto createRouteDto = CreateRouteDto.builder()
                .createdBy(userId)
                .name("Test Route")
                .description("Test Description")
                .points(samplePoints)
                .isPublic(true)
                .build();

            // When - Create entity from DTO
            Route route = RouteMapper.toEntity(createRouteDto);
            
            // Set timestamps and rating to simulate saved entity
            route.setCreatedAt(Instant.now());
            route.setLastUpdated(Instant.now());
            route.setRating(4.5);

            // Map back to response DTO
            ResponseRouteDto responseRouteDto = RouteMapper.toResponseRouteDto(route);

            // Then - Verify data integrity
            assertThat(responseRouteDto.getCreatedBy()).isEqualTo(createRouteDto.getCreatedBy());
            assertThat(responseRouteDto.getName()).isEqualTo(createRouteDto.getName());
            assertThat(responseRouteDto.getDescription()).isEqualTo(createRouteDto.getDescription());
            assertThat(responseRouteDto.getPoints()).isEqualTo(createRouteDto.getPoints());
            assertThat(responseRouteDto.getIsPublic()).isEqualTo(createRouteDto.getIsPublic());
        }
    }
}


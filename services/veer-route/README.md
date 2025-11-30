# Veer Route Service

Multi-module Maven project for Veer route data service.

## Modules

### veer-route-api
REST API controllers and interfaces for external communication.

### veer-route-model
Domain models, DTOs, and data structures.

### veer-route-service
Main service implementation with business logic.

## Building

```bash
mvn clean install
```

## Running

```bash
cd veer-route-api
mvn spring-boot:run
```

## Requirements

- Java 17+
- Maven 3.6+
- PostgreSQL database

## API Endpoints

- `POST /api/route` - Create a new route
- `GET /api/route/{routeId}` - Get route by ID
- `PUT /api/route/{routeId}` - Update route
- `DELETE /api/route/{routeId}` - Delete route

## Database Schema

The Route entity includes:
- `id`: Unique route identifier
- `createdBy`: User ID who created the route
- `points`: List of GeoJSON points
- `name`: Route name
- `description`: Route description
- `isPublic`: Public visibility flag
- `rating`: Route rating
- `createdAt`: Creation timestamp
- `lastUpdated`: Last update timestamp


# Veer User Service

Multi-module Maven project for Veer user data service.

## Modules

### veer-user-api
REST API controllers and interfaces for external communication.

### veer-user-model
Domain models, DTOs, and data structures.

### veer-user-service
Main service implementation with business logic.

## Building

```bash
mvn clean install
```

## Running

```bash
cd veer-user-service
mvn spring-boot:run
```

## Requirements

- Java 17+
- Maven 3.6+


package com.veer.route.api.exception;

import com.veer.route.model.exception.RouteAlreadyExistsException;
import com.veer.route.model.exception.RouteNotFoundException;
import jakarta.validation.ConstraintViolationException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingRequestHeaderException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import java.util.*;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

@DisplayName("GlobalExceptionHandler Tests")
class GlobalExceptionHandlerTest {

    private GlobalExceptionHandler exceptionHandler;

    @BeforeEach
    void setUp() {
        exceptionHandler = new GlobalExceptionHandler();
    }

    @Nested
    @DisplayName("handleRouteAlreadyExistsException Tests")
    class HandleRouteAlreadyExistsExceptionTests {

        @Test
        @DisplayName("Should handle RouteAlreadyExistsException with correct status and message")
        void shouldHandleRouteAlreadyExistsException() {
            // Given
            String message = "Route with id 'route-123' already exists";
            RouteAlreadyExistsException ex = new RouteAlreadyExistsException(message);

            // When
            ResponseEntity<Map<String, Object>> response = exceptionHandler.handleRouteAlreadyExistsException(ex);

            // Then
            assertThat(response).isNotNull();
            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CONFLICT);
            assertThat(response.getBody()).isNotNull();
            assertThat(response.getBody().get("status")).isEqualTo(409);
            assertThat(response.getBody().get("error")).isEqualTo("Conflict");
            assertThat(response.getBody().get("message")).isEqualTo(message);
            assertThat(response.getBody().get("timestamp")).isNotNull();
        }

        @Test
        @DisplayName("Should include timestamp in error response")
        void shouldIncludeTimestampInErrorResponse() {
            // Given
            RouteAlreadyExistsException ex = new RouteAlreadyExistsException("Route exists");

            // When
            ResponseEntity<Map<String, Object>> response = exceptionHandler.handleRouteAlreadyExistsException(ex);

            // Then
            assertThat(response.getBody().get("timestamp")).isNotNull();
            assertThat(response.getBody().get("timestamp")).isInstanceOf(java.time.Instant.class);
        }
    }

    @Nested
    @DisplayName("handleRouteNotFoundException Tests")
    class HandleRouteNotFoundExceptionTests {

        @Test
        @DisplayName("Should handle RouteNotFoundException with correct status and message")
        void shouldHandleRouteNotFoundException() {
            // Given
            String message = "Route route-123 not found";
            RouteNotFoundException ex = new RouteNotFoundException(message);

            // When
            ResponseEntity<Map<String, Object>> response = exceptionHandler.handleRouteNotFoundException(ex);

            // Then
            assertThat(response).isNotNull();
            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
            assertThat(response.getBody()).isNotNull();
            assertThat(response.getBody().get("status")).isEqualTo(404);
            assertThat(response.getBody().get("error")).isEqualTo("Not Found");
            assertThat(response.getBody().get("message")).isEqualTo(message);
            assertThat(response.getBody().get("timestamp")).isNotNull();
        }
    }

    @Nested
    @DisplayName("handleMissingRequestHeaderException Tests")
    class HandleMissingRequestHeaderExceptionTests {

        @Test
        @DisplayName("Should handle MissingRequestHeaderException with correct status and message")
        void shouldHandleMissingRequestHeaderException() {
            // Given
            String headerName = "X-User-Id";
            MissingRequestHeaderException ex = mock(MissingRequestHeaderException.class);
            when(ex.getHeaderName()).thenReturn(headerName);

            // When
            ResponseEntity<Map<String, Object>> response = exceptionHandler.handleMissingRequestHeaderException(ex);

            // Then
            assertThat(response).isNotNull();
            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
            assertThat(response.getBody()).isNotNull();
            assertThat(response.getBody().get("status")).isEqualTo(400);
            assertThat(response.getBody().get("error")).isEqualTo("Bad Request");
            assertThat(response.getBody().get("message")).isEqualTo("Required header '" + headerName + "' is missing");
            assertThat(response.getBody().get("timestamp")).isNotNull();
        }

        @Test
        @DisplayName("Should handle different header names")
        void shouldHandleDifferentHeaderNames() {
            // Given
            String headerName = "Authorization";
            MissingRequestHeaderException ex = mock(MissingRequestHeaderException.class);
            when(ex.getHeaderName()).thenReturn(headerName);

            // When
            ResponseEntity<Map<String, Object>> response = exceptionHandler.handleMissingRequestHeaderException(ex);

            // Then
            assertThat(response.getBody().get("message")).isEqualTo("Required header '" + headerName + "' is missing");
        }
    }

    @Nested
    @DisplayName("handleConstraintViolationException Tests")
    class HandleConstraintViolationExceptionTests {

        @Test
        @DisplayName("Should handle ConstraintViolationException with correct status and message")
        void shouldHandleConstraintViolationException() {
            // Given
            String message = "Validation failed: name must not be blank";
            ConstraintViolationException ex = mock(ConstraintViolationException.class);
            when(ex.getMessage()).thenReturn(message);

            // When
            ResponseEntity<Map<String, Object>> response = exceptionHandler.handleConstraintViolationException(ex);

            // Then
            assertThat(response).isNotNull();
            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
            assertThat(response.getBody()).isNotNull();
            assertThat(response.getBody().get("status")).isEqualTo(400);
            assertThat(response.getBody().get("error")).isEqualTo("Bad Request");
            assertThat(response.getBody().get("message")).isEqualTo(message);
            assertThat(response.getBody().get("timestamp")).isNotNull();
        }
    }

    @Nested
    @DisplayName("handleMethodArgumentNotValidException Tests")
    class HandleMethodArgumentNotValidExceptionTests {

        @Test
        @DisplayName("Should handle MethodArgumentNotValidException with single field error")
        void shouldHandleMethodArgumentNotValidExceptionWithSingleFieldError() {
            // Given
            MethodArgumentNotValidException ex = mock(MethodArgumentNotValidException.class);
            BindingResult bindingResult = mock(BindingResult.class);
            FieldError fieldError = new FieldError("createRouteDto", "name", "must not be blank");

            when(ex.getBindingResult()).thenReturn(bindingResult);
            when(bindingResult.getFieldErrors()).thenReturn(List.of(fieldError));

            // When
            ResponseEntity<Map<String, Object>> response = exceptionHandler.handleMethodArgumentNotValidException(ex);

            // Then
            assertThat(response).isNotNull();
            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
            assertThat(response.getBody()).isNotNull();
            assertThat(response.getBody().get("status")).isEqualTo(400);
            assertThat(response.getBody().get("error")).isEqualTo("Bad Request");
            assertThat(response.getBody().get("message")).asString()
                .contains("Validation failed")
                .contains("name")
                .contains("must not be blank");
            assertThat(response.getBody().get("timestamp")).isNotNull();
        }

        @Test
        @DisplayName("Should handle MethodArgumentNotValidException with multiple field errors")
        void shouldHandleMethodArgumentNotValidExceptionWithMultipleFieldErrors() {
            // Given
            MethodArgumentNotValidException ex = mock(MethodArgumentNotValidException.class);
            BindingResult bindingResult = mock(BindingResult.class);
            FieldError fieldError1 = new FieldError("createRouteDto", "name", "must not be blank");
            FieldError fieldError2 = new FieldError("createRouteDto", "points", "must not be null");
            FieldError fieldError3 = new FieldError("createRouteDto", "description", "size must be between 0 and 1000");

            when(ex.getBindingResult()).thenReturn(bindingResult);
            when(bindingResult.getFieldErrors()).thenReturn(List.of(fieldError1, fieldError2, fieldError3));

            // When
            ResponseEntity<Map<String, Object>> response = exceptionHandler.handleMethodArgumentNotValidException(ex);

            // Then
            assertThat(response).isNotNull();
            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
            String message = (String) response.getBody().get("message");
            assertThat(message).contains("Validation failed");
            assertThat(message).contains("name");
            assertThat(message).contains("points");
            assertThat(message).contains("description");
        }

        @Test
        @DisplayName("Should handle MethodArgumentNotValidException with no field errors")
        void shouldHandleMethodArgumentNotValidExceptionWithNoFieldErrors() {
            // Given
            MethodArgumentNotValidException ex = mock(MethodArgumentNotValidException.class);
            BindingResult bindingResult = mock(BindingResult.class);

            when(ex.getBindingResult()).thenReturn(bindingResult);
            when(bindingResult.getFieldErrors()).thenReturn(Collections.emptyList());

            // When
            ResponseEntity<Map<String, Object>> response = exceptionHandler.handleMethodArgumentNotValidException(ex);

            // Then
            assertThat(response).isNotNull();
            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
            assertThat(response.getBody().get("message")).asString().contains("Validation failed");
        }
    }

    @Nested
    @DisplayName("handleHttpMessageNotReadableException Tests")
    class HandleHttpMessageNotReadableExceptionTests {

        @Test
        @DisplayName("Should handle HttpMessageNotReadableException with correct status and message")
        void shouldHandleHttpMessageNotReadableException() {
            // Given
            HttpMessageNotReadableException ex = mock(HttpMessageNotReadableException.class);

            // When
            ResponseEntity<Map<String, Object>> response = exceptionHandler.handleHttpMessageNotReadableException(ex);

            // Then
            assertThat(response).isNotNull();
            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
            assertThat(response.getBody()).isNotNull();
            assertThat(response.getBody().get("status")).isEqualTo(400);
            assertThat(response.getBody().get("error")).isEqualTo("Bad Request");
            assertThat(response.getBody().get("message")).isEqualTo("Request body is missing or malformed.");
            assertThat(response.getBody().get("timestamp")).isNotNull();
        }
    }

    @Nested
    @DisplayName("handleMissingServletRequestParameterException Tests")
    class HandleMissingServletRequestParameterExceptionTests {

        @Test
        @DisplayName("Should handle MissingServletRequestParameterException with correct status and message")
        void shouldHandleMissingServletRequestParameterException() {
            // Given
            String parameterName = "routeId";
            MissingServletRequestParameterException ex = mock(MissingServletRequestParameterException.class);
            when(ex.getParameterName()).thenReturn(parameterName);

            // When
            ResponseEntity<Map<String, Object>> response = exceptionHandler.handleMissingServletRequestParameterException(ex);

            // Then
            assertThat(response).isNotNull();
            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
            assertThat(response.getBody()).isNotNull();
            assertThat(response.getBody().get("status")).isEqualTo(400);
            assertThat(response.getBody().get("error")).isEqualTo("Bad Request");
            assertThat(response.getBody().get("message")).isEqualTo("Required parameter '" + parameterName + "' is missing");
            assertThat(response.getBody().get("timestamp")).isNotNull();
        }

        @Test
        @DisplayName("Should handle different parameter names")
        void shouldHandleDifferentParameterNames() {
            // Given
            String parameterName = "userId";
            MissingServletRequestParameterException ex = mock(MissingServletRequestParameterException.class);
            when(ex.getParameterName()).thenReturn(parameterName);

            // When
            ResponseEntity<Map<String, Object>> response = exceptionHandler.handleMissingServletRequestParameterException(ex);

            // Then
            assertThat(response.getBody().get("message")).isEqualTo("Required parameter '" + parameterName + "' is missing");
        }
    }

    @Nested
    @DisplayName("handleMethodArgumentTypeMismatchException Tests")
    class HandleMethodArgumentTypeMismatchExceptionTests {

        @Test
        @DisplayName("Should handle MethodArgumentTypeMismatchException with correct status and message")
        void shouldHandleMethodArgumentTypeMismatchException() {
            // Given
            String parameterName = "routeId";
            MethodArgumentTypeMismatchException ex = mock(MethodArgumentTypeMismatchException.class);
            when(ex.getName()).thenReturn(parameterName);
            doReturn(String.class).when(ex).getRequiredType();

            // When
            ResponseEntity<Map<String, Object>> response = exceptionHandler.handleMethodArgumentTypeMismatchException(ex);

            // Then
            assertThat(response).isNotNull();
            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
            assertThat(response.getBody()).isNotNull();
            assertThat(response.getBody().get("status")).isEqualTo(400);
            assertThat(response.getBody().get("error")).isEqualTo("Bad Request");
            assertThat(response.getBody().get("message")).asString()
                .contains("Parameter '" + parameterName + "' has invalid value")
                .contains("String");
            assertThat(response.getBody().get("timestamp")).isNotNull();
        }

        @Test
        @DisplayName("Should handle MethodArgumentTypeMismatchException with null required type")
        void shouldHandleMethodArgumentTypeMismatchExceptionWithNullRequiredType() {
            // Given
            String parameterName = "routeId";
            MethodArgumentTypeMismatchException ex = mock(MethodArgumentTypeMismatchException.class);
            when(ex.getName()).thenReturn(parameterName);
            when(ex.getRequiredType()).thenReturn(null);

            // When
            ResponseEntity<Map<String, Object>> response = exceptionHandler.handleMethodArgumentTypeMismatchException(ex);

            // Then
            assertThat(response).isNotNull();
            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
            assertThat(response.getBody().get("message")).asString()
                .contains("Parameter '" + parameterName + "' has invalid value")
                .contains("unknown");
        }

        @Test
        @DisplayName("Should handle different parameter types")
        void shouldHandleDifferentParameterTypes() {
            // Given
            String parameterName = "page";
            MethodArgumentTypeMismatchException ex = mock(MethodArgumentTypeMismatchException.class);
            when(ex.getName()).thenReturn(parameterName);
            doReturn(Integer.class).when(ex).getRequiredType();

            // When
            ResponseEntity<Map<String, Object>> response = exceptionHandler.handleMethodArgumentTypeMismatchException(ex);

            // Then
            assertThat(response.getBody().get("message")).asString().contains("Integer");
        }
    }

    @Nested
    @DisplayName("handleIllegalArgumentException Tests")
    class HandleIllegalArgumentExceptionTests {

        @Test
        @DisplayName("Should handle IllegalArgumentException with correct status and message")
        void shouldHandleIllegalArgumentException() {
            // Given
            String message = "Invalid argument provided";
            IllegalArgumentException ex = new IllegalArgumentException(message);

            // When
            ResponseEntity<Map<String, Object>> response = exceptionHandler.handleIllegalArgumentException(ex);

            // Then
            assertThat(response).isNotNull();
            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
            assertThat(response.getBody()).isNotNull();
            assertThat(response.getBody().get("status")).isEqualTo(400);
            assertThat(response.getBody().get("error")).isEqualTo("Bad Request");
            assertThat(response.getBody().get("message")).isEqualTo(message);
            assertThat(response.getBody().get("timestamp")).isNotNull();
        }
    }

    @Nested
    @DisplayName("handleGenericException Tests")
    class HandleGenericExceptionTests {

        @Test
        @DisplayName("Should handle generic Exception with correct status and message")
        void shouldHandleGenericException() {
            // Given
            String message = "Unexpected error occurred";
            Exception ex = new Exception(message);

            // When
            ResponseEntity<Map<String, Object>> response = exceptionHandler.handleGenericException(ex);

            // Then
            assertThat(response).isNotNull();
            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.INTERNAL_SERVER_ERROR);
            assertThat(response.getBody()).isNotNull();
            assertThat(response.getBody().get("status")).isEqualTo(500);
            assertThat(response.getBody().get("error")).isEqualTo("Internal Server Error");
            assertThat(response.getBody().get("message")).asString()
                .contains("An unexpected error occurred")
                .contains(message);
            assertThat(response.getBody().get("timestamp")).isNotNull();
        }

        @Test
        @DisplayName("Should handle RuntimeException as generic exception")
        void shouldHandleRuntimeExceptionAsGenericException() {
            // Given
            String message = "Runtime error";
            RuntimeException ex = new RuntimeException(message);

            // When
            ResponseEntity<Map<String, Object>> response = exceptionHandler.handleGenericException(ex);

            // Then
            assertThat(response).isNotNull();
            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.INTERNAL_SERVER_ERROR);
            assertThat(response.getBody().get("message")).asString().contains(message);
        }

        @Test
        @DisplayName("Should handle NullPointerException as generic exception")
        void shouldHandleNullPointerExceptionAsGenericException() {
            // Given
            NullPointerException ex = new NullPointerException("Null value");

            // When
            ResponseEntity<Map<String, Object>> response = exceptionHandler.handleGenericException(ex);

            // Then
            assertThat(response).isNotNull();
            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.INTERNAL_SERVER_ERROR);
            assertThat(response.getBody().get("message")).asString().contains("Null value");
        }
    }

    @Nested
    @DisplayName("Error Response Structure Tests")
    class ErrorResponseStructureTests {

        @Test
        @DisplayName("All error responses should have consistent structure")
        void allErrorResponsesShouldHaveConsistentStructure() {
            // Given
            RouteNotFoundException ex = new RouteNotFoundException("Test message");

            // When
            ResponseEntity<Map<String, Object>> response = exceptionHandler.handleRouteNotFoundException(ex);

            // Then
            Map<String, Object> body = response.getBody();
            assertThat(body).containsKeys("timestamp", "status", "error", "message");
            assertThat(body.get("timestamp")).isInstanceOf(java.time.Instant.class);
            assertThat(body.get("status")).isInstanceOf(Integer.class);
            assertThat(body.get("error")).isInstanceOf(String.class);
            assertThat(body.get("message")).isInstanceOf(String.class);
        }

        @Test
        @DisplayName("Error response should have correct data types")
        void errorResponseShouldHaveCorrectDataTypes() {
            // Given
            IllegalArgumentException ex = new IllegalArgumentException("Test");

            // When
            ResponseEntity<Map<String, Object>> response = exceptionHandler.handleIllegalArgumentException(ex);

            // Then
            Map<String, Object> body = response.getBody();
            assertThat(body.get("timestamp")).isInstanceOf(java.time.Instant.class);
            assertThat(body.get("status")).isInstanceOf(Integer.class);
            assertThat(body.get("error")).isInstanceOf(String.class);
            assertThat(body.get("message")).isInstanceOf(String.class);
        }
    }
}


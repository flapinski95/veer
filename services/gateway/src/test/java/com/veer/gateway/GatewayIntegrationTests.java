package com.veer.gateway;

import okhttp3.mockwebserver.Dispatcher;
import okhttp3.mockwebserver.MockResponse;
import okhttp3.mockwebserver.MockWebServer;
import okhttp3.mockwebserver.RecordedRequest;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.HttpHeaders;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.web.reactive.server.WebTestClient;
import org.springframework.util.StreamUtils;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class GatewayIntegrationTests {

    private static MockWebServer mockAuthServer;
    // Use a field to capture the proxied request for detailed assertions
    private static volatile RecordedRequest lastProxiedRequest;

    @Autowired
    private WebTestClient webTestClient;

    @BeforeEach
    void setup() {
        // Reset before each test
        lastProxiedRequest = null;
    }

    @BeforeAll
    static void startMockAuthServer() throws IOException {
        mockAuthServer = new MockWebServer();
        mockAuthServer.start();

        // Configure the mock server to respond like Keycloak
        final Dispatcher dispatcher = new Dispatcher() {
            @Override
            public MockResponse dispatch(RecordedRequest request) {
                String path = request.getPath();
                if (path == null) {
                    return new MockResponse().setResponseCode(404);
                }
                String issuerUri = mockAuthServer.url("/realms/veer").toString();

                if (path.equals("/realms/veer/.well-known/openid-configuration")) {
                    return new MockResponse()
                            .setResponseCode(200)
                            .setHeader(HttpHeaders.CONTENT_TYPE, "application/json")
                            .setBody(readResource("openid-configuration.json")
                                    .replace("http://localhost", issuerUri.substring(0, issuerUri.length() - "/realms/veer".length())));
                } else if (path.equals("/realms/veer/protocol/openid-connect/certs")) {
                    return new MockResponse()
                            .setResponseCode(200)
                            .setHeader(HttpHeaders.CONTENT_TYPE, "application/json")
                            .setBody(JwtTestUtils.generateJwks(JwtTestUtils.getKeyPair()));
                } else if (path.equals("/api/auth/health")) {
                    lastProxiedRequest = request;
                    return new MockResponse().setResponseCode(200).setBody("OK");
                } else if (path.startsWith("/api/user/")) {
                    lastProxiedRequest = request;
                    return new MockResponse().setResponseCode(200).setBody("User Data");
                }
                return new MockResponse().setResponseCode(404);
            }
        };
        mockAuthServer.setDispatcher(dispatcher);
    }

    @AfterAll
    static void stopMockAuthServer() throws IOException {
        mockAuthServer.shutdown();
    }

    @DynamicPropertySource
    static void overrideProperties(DynamicPropertyRegistry registry) {
        String issuerUri = mockAuthServer.url("/realms/veer").toString();
        registry.add("spring.security.oauth2.resourceserver.jwt.issuer-uri", () -> issuerUri);
        registry.add("services.auth.uri", () -> "http://localhost:" + mockAuthServer.getPort());
        registry.add("services.user.uri", () -> "http://localhost:" + mockAuthServer.getPort());
    }

    @Test
    void unauthenticatedRequestToUserRoute_shouldReturn401() {
        webTestClient.get().uri("/api/user/profile")
                .exchange()
                .expectStatus().isUnauthorized();
    }

    @Test
    void authenticatedRequestToUserRoute_shouldBeProxiedAndAddHeaders() throws InterruptedException {
        String token = JwtTestUtils.createToken(mockAuthServer.url("/realms/veer").toString());
        String userId = "some-user-id";

        webTestClient.get().uri("/api/user/" + userId)
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + token)
                .exchange()
                .expectStatus().isOk();

        // Verify that the custom headers were added by the filter
        assertThat(lastProxiedRequest).isNotNull();
        assertThat(lastProxiedRequest.getPath()).isEqualTo("/api/user/" + userId);
        assertThat(lastProxiedRequest.getHeader("X-User-Id")).isNotNull();
        assertThat(lastProxiedRequest.getHeader("X-User-Email")).isEqualTo("test-user@veer.com");
        assertThat(lastProxiedRequest.getHeader("X-User-Name")).isEqualTo("test-user");
        assertThat(lastProxiedRequest.getHeader("X-User-Country")).isEqualTo("Poland");
    }

    private static String readResource(String path) {
        try {
            var resource = new ClassPathResource(path);
            return StreamUtils.copyToString(resource.getInputStream(), StandardCharsets.UTF_8);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }
}

package com.veer.gateway.config;

import com.veer.gateway.filters.AddUserDetailsHeaderGatewayFilterFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class GatewayRoutes {

    private final AddUserDetailsHeaderGatewayFilterFactory addUserDetailsHeaderFilter;
    private final String authServiceUri;
    private final String userServiceUri;

    public GatewayRoutes(
            AddUserDetailsHeaderGatewayFilterFactory addUserDetailsHeaderFilter,
            @Value("${services.auth.uri}") String authServiceUri,
            @Value("${services.user.uri}") String userServiceUri) {
        this.addUserDetailsHeaderFilter = addUserDetailsHeaderFilter;
        this.authServiceUri = authServiceUri;
        this.userServiceUri = userServiceUri;
    }

    @Bean
    public RouteLocator routeLocator(RouteLocatorBuilder builder) {
        return builder.routes()
                .route("auth-service", r -> r.path("/api/auth/**")
                        .uri(authServiceUri))
                .route("user-service", r -> r.path("/api/user/**")
                        .filters(f -> f.filter(addUserDetailsHeaderFilter
                                .apply(new AddUserDetailsHeaderGatewayFilterFactory.Config())))
                        .uri(userServiceUri))
                .build();
    }
}

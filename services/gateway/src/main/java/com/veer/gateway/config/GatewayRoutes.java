package com.veer.gateway.config;

import com.veer.gateway.filters.AddUserDetailsHeaderGatewayFilterFactory;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

// Gateway routes configuration.
@Configuration
public class GatewayRoutes {

    private final AddUserDetailsHeaderGatewayFilterFactory addUserDetailsHeaderFilter;

    public GatewayRoutes(AddUserDetailsHeaderGatewayFilterFactory addUserDetailsHeaderFilter) {
        this.addUserDetailsHeaderFilter = addUserDetailsHeaderFilter;
    }

    @Bean
    public RouteLocator routeLocator(RouteLocatorBuilder builder) {
        return builder.routes()
            .route("auth-service", r -> r.path("/api/auth/**")
                .uri("http://auth-service:3002"))
            .route("user-service", r -> r.path("/api/user/**")
                .filters(f -> f.filter(addUserDetailsHeaderFilter
                    .apply(new AddUserDetailsHeaderGatewayFilterFactory.Config())))
                .uri("http://user-service:3003"))
            .build();
    }
}

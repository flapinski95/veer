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
    private final String userServiceUri;
    private final String routeServiceUri;

    public GatewayRoutes(
            AddUserDetailsHeaderGatewayFilterFactory addUserDetailsHeaderFilter,
            @Value("${services.user.uri}") String userServiceUri,
            @Value("${services.route.uri}") String routeServiceUri) {
        this.addUserDetailsHeaderFilter = addUserDetailsHeaderFilter;
        this.userServiceUri = userServiceUri;
        this.routeServiceUri = routeServiceUri;
    }

    @Bean
    public RouteLocator routeLocator(RouteLocatorBuilder builder) {
        return builder.routes()

                .route("user-service", r -> r.path("/api/user/**")
                        .filters(f -> f.filter(addUserDetailsHeaderFilter
                                .apply(new AddUserDetailsHeaderGatewayFilterFactory.Config())))
                        .uri(userServiceUri))

                .route("route-service", r -> r.path(
                                "/api/route",        
                                "/api/route/",       
                                "/api/route/**"      
                        )
                        .filters(f -> f.filter(addUserDetailsHeaderFilter
                                .apply(new AddUserDetailsHeaderGatewayFilterFactory.Config())))
                        .uri(routeServiceUri))

                .build();
    }
}
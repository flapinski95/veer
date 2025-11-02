package com.veer.gateway.filters;

import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.security.core.context.ReactiveSecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Component;

@Component
public class AddUserDetailsHeaderGatewayFilterFactory extends AbstractGatewayFilterFactory<AddUserDetailsHeaderGatewayFilterFactory.Config> {

    public AddUserDetailsHeaderGatewayFilterFactory() {
        super(Config.class);
    }

    @Override
    public GatewayFilter apply(Config config) {
        return (exchange, chain) -> ReactiveSecurityContextHolder.getContext()
                .map(ctx -> ctx.getAuthentication().getPrincipal())
                .cast(Jwt.class)
                .flatMap(jwt -> {
                    exchange.getRequest().mutate()
                            .header("X-User-Id", jwt.getSubject())
                            .header("X-User-Email", jwt.getClaimAsString("email"))
                            .build();
                    return chain.filter(exchange);
                })
                .switchIfEmpty(chain.filter(exchange));
    }

    public static class Config {
        // empty class as we don't need configuration properties
    }
}

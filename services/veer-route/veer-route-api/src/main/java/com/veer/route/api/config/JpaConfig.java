package com.veer.route.api.config;

import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@Configuration
@EnableJpaRepositories(basePackages = "com.veer.route.repository")
@EntityScan(basePackages = "com.veer.route.model")
public class JpaConfig {
}
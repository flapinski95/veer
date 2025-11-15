package com.veer.user.api.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.boot.autoconfigure.domain.EntityScan;

@Configuration
@EnableJpaRepositories(basePackages = "com.veer.user.repository")
@EntityScan(basePackages = "com.veer.user.model")
public class JpaConfig {
}

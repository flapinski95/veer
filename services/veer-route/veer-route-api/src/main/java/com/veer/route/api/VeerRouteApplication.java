package com.veer.route.api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EntityScan("com.veer.route.model")
@ComponentScan("com.veer.route")
@EnableJpaRepositories("com.veer.route.repository")
public class VeerRouteApplication {

    public static void main(String[] args) {
        SpringApplication.run(VeerRouteApplication.class, args);
    }

}


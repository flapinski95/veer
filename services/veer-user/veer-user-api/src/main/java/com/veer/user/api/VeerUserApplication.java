package com.veer.user.api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@ComponentScan        (basePackages = "com.veer.user")
@EnableJpaRepositories(basePackages = "com.veer.user.repository")
@EntityScan           (basePackages = "com.veer.user.model")
public class VeerUserApplication {

    public static void main(String[] args) {
        SpringApplication.run(VeerUserApplication.class, args);
    }

}


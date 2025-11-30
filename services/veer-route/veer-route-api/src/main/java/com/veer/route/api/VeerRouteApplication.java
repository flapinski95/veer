package com.veer.route.api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackages = "com.veer.route")
public class VeerRouteApplication {

    public static void main(String[] args) {
        SpringApplication.run(VeerRouteApplication.class, args);
    }

}


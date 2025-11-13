package com.veer.user.api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan(basePackages = "com.veer.user")
public class VeerUserApplication {

    public static void main(String[] args) {
        SpringApplication.run(VeerUserApplication.class, args);
    }

}


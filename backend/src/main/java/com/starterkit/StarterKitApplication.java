package com.starterkit;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableAsync(proxyTargetClass = true)
@EnableScheduling
@ConfigurationPropertiesScan
@SpringBootApplication
public class StarterKitApplication {

    public static void main(String[] args) {
        SpringApplication.run(StarterKitApplication.class, args);
    }
}

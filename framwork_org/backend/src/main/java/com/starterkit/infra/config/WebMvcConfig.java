package com.starterkit.infra.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Path;

@Configuration
@RequiredArgsConstructor
public class WebMvcConfig implements WebMvcConfigurer {

    private final StarterProperties starterProperties;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        String publicDir = starterProperties.storage().publicDir();
        String location = Path.of(publicDir).toAbsolutePath().normalize().toUri().toString();
        if (!location.endsWith("/")) {
            location += "/";
        }
        registry.addResourceHandler("/uploads/public/**")
                .addResourceLocations(location);
    }
}

package com.ngoconnect.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

@Configuration
public class AppConfig {
    
    @Bean
    @Profile("!prod")
    public Boolean disableEmailVerification() {
        return true;
    }
    
    // ModelMapper configuration moved to ModelMapperConfig
}

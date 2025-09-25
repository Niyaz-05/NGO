package com.ngoconnect;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan(basePackages = {"com.ngoconnect"})
public class NgoConnectBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(NgoConnectBackendApplication.class, args);
    }

}

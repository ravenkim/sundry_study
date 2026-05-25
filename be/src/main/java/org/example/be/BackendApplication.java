package org.example.be;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class BackendApplication {
    //backend main code
    public static void main(String[] args) {
        SpringApplication.run(BackendApplication.class, args);
    }

}

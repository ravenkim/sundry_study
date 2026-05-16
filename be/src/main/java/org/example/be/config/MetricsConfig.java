package org.example.be.config;

import org.example.be.domain.model.Member;
import io.micrometer.core.instrument.Counter;
import io.micrometer.core.instrument.Gauge;
import io.micrometer.core.instrument.MeterRegistry;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class MetricsConfig {

    private final Counter createUserCounter;

    // Constructor injection for Counter
    public MetricsConfig(MeterRegistry meterRegistry) {
        this.createUserCounter = Counter.builder("api.courses.created.count")
                .description("The total number of created courses")
                .register(meterRegistry);
    }

    public Member createUser(Member user) {
        createUserCounter.increment(); // Increment the counter when a user is created
        return user; // Return the created user
    }

    @Bean
    public Gauge createGauge(MeterRegistry meterRegistry) {
        return Gauge.builder("api.courses.created.gauge", () -> 5) // Replace with actual active course count logic
                .description("The current number of active courses")
                .register(meterRegistry);
    }
}

package com.swiftcart.order;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.client.RestTemplate;

// ============================================================================
// order-service — creates orders and (currently) orchestrates the whole
// purchase flow synchronously and badly. This is the service you evolve the
// most. Nearly every tier's task touches OrderService.java.
// ============================================================================
@SpringBootApplication
public class OrderServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(OrderServiceApplication.class, args);
    }

    // 📝 TIER 3/6 TASK: this RestTemplate has NO connect/read timeout configured
    // → a slow/hung downstream service blocks this thread indefinitely (thread
    // pool exhaustion → whole service unresponsive). Newman Ch 12 calls the
    // missing timeout the #1 resiliency sin. First give it timeouts; later
    // (tier 6) wrap calls in Resilience4j circuit breakers, or (tier 3) replace
    // it with a declarative OpenFeign client.
    @Bean
    RestTemplate restTemplate() {
        return new RestTemplate(); // 🐛 no timeouts, no resilience
    }
}

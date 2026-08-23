package com.swiftcart.gateway;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

// ============================================================================
// gateway — the single front door (Newman Ch 5: API Gateway; Ch 14: BFF).
// Clients hit :8080; the gateway routes to the right service. Benefits: one
// entry point, cross-cutting concerns in one place (auth, rate limiting, CORS),
// and clients don't need to know service topology.
//
// 📝 TIER 3 TASK: routes are configured in application.yml. Add them for order
// and (later) hide payment/notification (internal-only — NOT every service
// belongs behind the public gateway).
// 📝 TIER 9 TASK: enforce auth here; propagate identity downstream.
// ⚠️ DESIGN WARNING (DECISIONS #5): resist putting business logic in the
// gateway. A "smart gateway" becomes a new monolith and a deployment
// bottleneck every team must queue behind. Keep it dumb: routing + cross-
// cutting only.
// ============================================================================
@SpringBootApplication
public class GatewayApplication {
    public static void main(String[] args) {
        SpringApplication.run(GatewayApplication.class, args);
    }
}

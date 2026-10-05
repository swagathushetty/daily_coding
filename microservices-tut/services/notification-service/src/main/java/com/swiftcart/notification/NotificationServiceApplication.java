package com.swiftcart.notification;

import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication
public class NotificationServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(NotificationServiceApplication.class, args);
    }
}

// ============================================================================
// notification-service — TODAY it's a synchronous REST endpoint that
// order-service calls inline (temporal coupling — Sin 4 in OrderService).
//
// 📝 TIER 5 TASK (async / event-driven): replace this REST controller with a
// Kafka @KafkaListener that consumes "OrderPlaced" events. Then:
//   - order-service no longer waits on notifications (kill Sin 4)
//   - if THIS service is down, orders still succeed; it processes the backlog
//     when it comes back (that's the resilience win of async)
//   - discuss at-least-once delivery → your consumer must be IDEMPOTENT
//     (dedupe by event id) because Kafka can redeliver.
// ============================================================================
@RestController
@RequestMapping("/notifications")
class NotificationController {
    private static final Logger log = LoggerFactory.getLogger(NotificationController.class);

    @PostMapping
    public Map<String, Object> notify(@RequestBody Map<String, Object> body) {
        log.info("📣 NOTIFICATION: {}", body.get("message"));
        return Map.of("sent", true);
    }
}

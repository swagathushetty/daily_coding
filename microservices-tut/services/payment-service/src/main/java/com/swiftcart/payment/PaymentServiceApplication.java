package com.swiftcart.payment;

import java.util.Map;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication
public class PaymentServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(PaymentServiceApplication.class, args);
    }
}

// ============================================================================
// payment-service — intentionally has a DETERMINISTIC failure path so the saga
// (tier 5) has something to compensate: orders over ₹1000 (100000 cents) are
// DECLINED. Everything cheaper is approved.
//
// 📝 TIER 6 TASK (Resiliency): add a "chaos" switch here — an artificial
// Thread.sleep and/or random 500s toggled by a header or config — so you can
// watch order-service's circuit breaker OPEN, trip to a fallback, then close
// again as payment recovers. Right now it always responds fast, so there's
// nothing for a breaker to react to.
// ============================================================================
@RestController
@RequestMapping("/payments")
class PaymentController {

    @PostMapping
    public Map<String, Object> pay(@RequestBody Map<String, Object> body) {
        long total = ((Number) body.getOrDefault("orderTotalCents", 0)).longValue();
        boolean approved = total <= 100_000; // 🎯 deterministic decline path
        return Map.of(
                "approved", approved,
                "reason", approved ? "ok" : "amount exceeds limit"
        );
    }
}

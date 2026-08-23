package com.swiftcart.order;

import java.util.Map;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

// ============================================================================
// OrderService — the distributed-monolith heart. Read the createOrder flow
// top to bottom: it commits almost every mistake in Newman's book at once.
// Each tier peels one off. The task markers tell you which.
// ============================================================================
@Service
public class OrderService {

    private final OrderRepository orders;
    private final ProductPeekRepository productsSharedDb; // 🐛 tier 4
    private final RestTemplate http;

    // Hard-coded downstream URLs. 📝 TIER 3 TASK (Service discovery): hard-coded
    // host:port breaks the moment you scale/redeploy a service. Replace with
    // discovery (Eureka/Consul) or at least externalized config, and route
    // through the gateway. Newman Ch 5.
    private static final String PAYMENT_URL = "http://localhost:8083";
    private static final String NOTIFY_URL = "http://localhost:8084";

    public OrderService(OrderRepository orders,
                        ProductPeekRepository productsSharedDb,
                        RestTemplate http) {
        this.orders = orders;
        this.productsSharedDb = productsSharedDb;
        this.http = http;
    }

    public Order createOrder(Long productId, int quantity) {
        // --------------------------------------------------------------------
        // 🐛 SIN 1 (tier 4) — reading/writing catalog's data via the SHARED DB.
        // order-service has no business touching the products table. It should
        // ask catalog-service over its API.
        // --------------------------------------------------------------------
        ProductPeek product = productsSharedDb.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("no such product"));

        // --------------------------------------------------------------------
        // 🐛 SIN 2 (tier 4/5) — decrementing stock in another service's table,
        // with a check-then-act RACE (two orders can both pass the check and
        // oversell). No transaction spans this + payment either.
        // --------------------------------------------------------------------
        if (product.getStock() < quantity) {
            throw new IllegalStateException("out of stock");
        }
        product.setStock(product.getStock() - quantity);
        productsSharedDb.save(product); // writes catalog's data. yuck.

        long total = product.getPriceCents() * quantity;

        // --------------------------------------------------------------------
        // 🐛 SIN 3 (tier 3/6) — SYNCHRONOUS, UNPROTECTED call to payment.
        // No timeout, no retry, no circuit breaker, no fallback. If payment is
        // slow, this request thread hangs; if payment is down, this throws and
        // we've ALREADY decremented stock with no way to put it back → SIN 5.
        // --------------------------------------------------------------------
        Map<?, ?> payment = http.postForObject(
                PAYMENT_URL + "/payments",
                Map.of("orderTotalCents", total),
                Map.class); // 🐛 unprotected

        boolean paid = payment != null && Boolean.TRUE.equals(payment.get("approved"));

        // --------------------------------------------------------------------
        // 🐛 SIN 4 (tier 5) — TEMPORAL COUPLING to notifications. Sending the
        // confirmation is done synchronously and INLINE. If notification-service
        // is down, the whole order fails — even though notifying is not
        // essential to placing an order. This should be an ASYNC EVENT: order
        // emits "OrderPlaced", notification consumes it on its own time.
        // --------------------------------------------------------------------
        http.postForObject(
                NOTIFY_URL + "/notifications",
                Map.of("message", "Your order for " + product.getName() + " is placed"),
                Map.class); // 🐛 synchronous side-quest that can sink the order

        // --------------------------------------------------------------------
        // 🐛 SIN 5 (tier 5) — NO SAGA / NO COMPENSATION. There is no atomicity
        // across services. If payment declined, stock was already taken. If
        // this method throws anywhere after the stock decrement, we leak stock
        // forever. Distributed transactions (2PC) are Newman's "just say no";
        // the answer is a SAGA with compensating actions (release stock, refund)
        // coordinated by events (choreography) or an orchestrator.
        // --------------------------------------------------------------------
        String status = paid ? "CONFIRMED" : "PAYMENT_FAILED";
        return orders.save(new Order(productId, quantity, total, status));
    }
}

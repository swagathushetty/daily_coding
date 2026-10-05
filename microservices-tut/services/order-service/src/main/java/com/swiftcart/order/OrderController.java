package com.swiftcart.order;

import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/orders")
public class OrderController {

    private final OrderService service;
    private final OrderRepository repo;

    public OrderController(OrderService service, OrderRepository repo) {
        this.service = service;
        this.repo = repo;
    }

    // POST /orders {"productId":1,"quantity":2}
    // 📝 TIER 5 (idempotency): a client retry (network blip) creates a DUPLICATE
    // order today. Real order endpoints take an Idempotency-Key header and
    // dedupe. Add it when you build the saga.
    @PostMapping
    public Order create(@RequestBody CreateOrder body) {
        return service.createOrder(body.productId(), body.quantity());
    }

    @GetMapping
    public List<Order> all() {
        return repo.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Order> byId(@PathVariable Long id) {
        return repo.findById(id).map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    public record CreateOrder(Long productId, int quantity) {}
}

package com.swiftcart.catalog;

import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

// ============================================================================
// The PUBLIC contract of catalog-service. This REST API is the ONLY legitimate
// way other services should learn about products. (order-service currently
// cheats by reading the DB table directly — tier 4 forces it to come through
// here instead. This controller is what it will call.)
//
// 📝 TIER 3 TASK (Communication): note the stock-reservation endpoint below.
// order-service will call it. Decide: is reserving stock a good synchronous
// request/response call, or should it be event-driven? (Discuss in DECISIONS
// #4. For the saga in tier 5 you'll likely emit a StockReserved/Failed event.)
// ============================================================================
@RestController
@RequestMapping("/products")
public class ProductController {

    private final ProductRepository repo;

    public ProductController(ProductRepository repo) {
        this.repo = repo;
    }

    @GetMapping
    public List<Product> all() {
        return repo.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> byId(@PathVariable Long id) {
        return repo.findById(id).map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Product create(@RequestBody CreateProduct body) {
        return repo.save(new Product(body.name(), body.priceCents(), body.stock()));
    }

    // Reserve stock for an order (decrement if available). Returns 409 if not
    // enough stock — the "business failure" the saga must handle (tier 5).
    @PostMapping("/{id}/reserve")
    public ResponseEntity<Product> reserve(@PathVariable Long id, @RequestBody Reserve body) {
        return repo.findById(id).map(p -> {
            if (p.getStock() < body.quantity()) {
                return ResponseEntity.status(409).<Product>build();
            }
            p.setStock(p.getStock() - body.quantity());
            return ResponseEntity.ok(repo.save(p));
        }).orElse(ResponseEntity.notFound().build());
    }

    public record CreateProduct(String name, long priceCents, int stock) {}
    public record Reserve(int quantity) {}
}

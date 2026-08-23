package com.swiftcart.catalog;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

// ============================================================================
// 📝 TIER 4 TASK (Database-per-service) — table name is deliberately generic.
// Right now this @Entity maps to a table in the SHARED `swiftcart` DB, and
// order-service reads the SAME table directly (see order-service — the crime).
// When you split databases, catalog OWNS this table and it lives only in the
// catalog DB; nobody else touches it. State ownership is a core Newman rule:
// "a microservice owns its own data; others ask via its API, never its tables."
// ============================================================================
@Entity
@Table(name = "products")
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private long priceCents;
    private int stock;

    protected Product() {}

    public Product(String name, long priceCents, int stock) {
        this.name = name;
        this.priceCents = priceCents;
        this.stock = stock;
    }

    public Long getId() { return id; }
    public String getName() { return name; }
    public long getPriceCents() { return priceCents; }
    public int getStock() { return stock; }
    public void setStock(int stock) { this.stock = stock; }
}

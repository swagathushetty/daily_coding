package com.swiftcart.order;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

// ============================================================================
// 📝 TIER 4 TASK (Database-per-service) — THE SHARED-DATABASE CRIME.
// ============================================================================
// This @Entity maps to catalog-service's OWN `products` table. order-service
// reads AND writes it directly (see OrderService.reserveStockTheBadWay). This
// is the worst coupling Newman describes ("common coupling" / shared mutable
// data): catalog can't change its schema without breaking order, two services
// write the same rows with no coordination (lost updates), and there is no
// real service boundary at all — it's a distributed monolith wearing a
// microservices costume.
//
// ✅ THE FIX (tier 4):
//   1. DELETE this class entirely. order-service must NOT know catalog's tables.
//   2. Get product data by calling catalog's REST API (tier 3), and reserve
//      stock via POST /products/{id}/reserve — catalog mutates its OWN data.
//   3. Give each service its own database (edit docker-compose + application.yml)
//      so this kind of cheating becomes physically impossible.
// This deletion is the single most important step in the whole course.
// ============================================================================
@Entity
@Table(name = "products") // 🐛 another service's table
public class ProductPeek {
    @Id
    private Long id;
    private String name;
    private long priceCents;
    private int stock;

    public Long getId() { return id; }
    public String getName() { return name; }
    public long getPriceCents() { return priceCents; }
    public int getStock() { return stock; }
    public void setStock(int stock) { this.stock = stock; }
}

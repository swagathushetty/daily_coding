package com.swiftcart.order;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

// order-service OWNS orders (this is legitimately its data). Contrast with
// ProductPeek.java, where it illegitimately reaches into catalog's table.
@Entity
@Table(name = "orders")
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long productId;
    private int quantity;
    private long totalCents;

    // 📝 TIER 5 (Sagas): a real saga tracks state so it can compensate on
    // failure. Right now status is basically "CREATED and hope for the best".
    // You'll grow this into PENDING → STOCK_RESERVED → PAID → CONFIRMED, with
    // FAILED/COMPENSATED branches driven by events.
    private String status;

    protected Order() {}

    public Order(Long productId, int quantity, long totalCents, String status) {
        this.productId = productId;
        this.quantity = quantity;
        this.totalCents = totalCents;
        this.status = status;
    }

    public Long getId() { return id; }
    public Long getProductId() { return productId; }
    public int getQuantity() { return quantity; }
    public long getTotalCents() { return totalCents; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}

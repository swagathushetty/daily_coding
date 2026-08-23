package com.swiftcart.order;

import org.springframework.data.jpa.repository.JpaRepository;

// 📝 TIER 4: delete alongside ProductPeek — order-service should reach products
// only through catalog's API, never a repository over catalog's table.
public interface ProductPeekRepository extends JpaRepository<ProductPeek, Long> {
}

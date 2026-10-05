package com.swiftcart.catalog;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

// ============================================================================
// catalog-service — owns PRODUCTS. This is the most "correct" service; it's
// your reference for what a clean small service looks like. The interesting
// (deliberately-wrong) code lives in order-service.
// ============================================================================
@SpringBootApplication
public class CatalogServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(CatalogServiceApplication.class, args);
    }
}

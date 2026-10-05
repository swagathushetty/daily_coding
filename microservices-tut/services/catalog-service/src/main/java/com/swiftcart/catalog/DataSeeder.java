package com.swiftcart.catalog;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataSeeder {
    @Bean
    CommandLineRunner seed(ProductRepository repo) {
        return args -> {
            if (repo.count() > 0) return;
            repo.save(new Product("Wireless Mouse", 1999, 100));
            repo.save(new Product("Mechanical Keyboard", 7999, 50));
            repo.save(new Product("USB-C Hub", 3499, 5));   // low stock → saga failures
            repo.save(new Product("4K Monitor", 29999, 20));
        };
    }
}

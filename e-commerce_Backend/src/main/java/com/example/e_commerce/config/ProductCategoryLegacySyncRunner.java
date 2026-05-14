package com.example.e_commerce.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.function.Predicate;

/**
 * DB cũ còn {@code product.category_id} trong khi entity dùng ManyMany qua {@code product_category}.
 * Hibernate không đọc {@code category_id} — bảng nối trống thì lọc category / API categories rỗng.
 * Khởi động: tạo bảng nếu thiếu, rồi INSERT IGNORE từ cột legacy.
 */
@Component
@Order(1000)
public class ProductCategoryLegacySyncRunner implements ApplicationRunner {

    private static final Logger log = LoggerFactory.getLogger(ProductCategoryLegacySyncRunner.class);

    private final DataSource dataSource;

    public ProductCategoryLegacySyncRunner(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    @Override
    public void run(ApplicationArguments args) {
        try (Connection connection = dataSource.getConnection();
             Statement statement = connection.createStatement()) {

            statement.executeUpdate("""
                    CREATE TABLE IF NOT EXISTS product_category (
                      product_id BIGINT NOT NULL,
                      category_id BIGINT NOT NULL,
                      PRIMARY KEY (product_id, category_id),
                      CONSTRAINT fk_pc_product_sync FOREIGN KEY (product_id) REFERENCES product (id),
                      CONSTRAINT fk_pc_category_sync FOREIGN KEY (category_id) REFERENCES category (id)
                    )
                    """);

            int inserted = statement.executeUpdate("""
                    INSERT IGNORE INTO product_category (product_id, category_id)
                    SELECT id, category_id FROM product
                    WHERE category_id IS NOT NULL
                    """);
            log.info("Legacy product.category_id -> product_category sync finished (inserted or ignored rows: {})", inserted);
        } catch (SQLException e) {
            if (firstMatchingSqlException(e, ProductCategoryLegacySyncRunner::isUnknownColumnCategoryId) != null) {
                log.info("Skipping legacy category sync (no product.category_id column): {}", e.getMessage());
                return;
            }
            log.warn("Legacy category sync failed: {}", e.getMessage());
        }
    }

    private static SQLException firstMatchingSqlException(SQLException e, Predicate<SQLException> p) {
        for (SQLException x = e; x != null; x = x.getNextException()) {
            if (p.test(x)) {
                return x;
            }
        }
        return null;
    }

    private static boolean isUnknownColumnCategoryId(SQLException e) {
        return "42S22".equals(e.getSQLState())
                || (e.getMessage() != null && e.getMessage().contains("Unknown column")
                && e.getMessage().contains("category_id"));
    }
}

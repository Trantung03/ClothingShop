-- Khi bảng product VẪN CÓ cột category_id nhưng app dùng ManyToMany -> bảng product_category.
-- Hibernate KHÔNG đọc category_id; nếu product_category trống thì API categories=[] và lọc category = 0.
-- Chạy script này (MySQL) để copy dữ liệu sang product_category. Có thể chạy nhiều lần (INSERT IGNORE).

CREATE TABLE IF NOT EXISTS product_category (
  product_id BIGINT NOT NULL,
  category_id BIGINT NOT NULL,
  PRIMARY KEY (product_id, category_id),
  CONSTRAINT fk_pc_product FOREIGN KEY (product_id) REFERENCES product (id),
  CONSTRAINT fk_pc_category FOREIGN KEY (category_id) REFERENCES category (id)
);

INSERT IGNORE INTO product_category (product_id, category_id)
SELECT id, category_id FROM product WHERE category_id IS NOT NULL;

-- (Tùy chọn, sau khi đã kiểm tra app chạy đúng) gỡ cột cũ để tránh nhầm:
-- ALTER TABLE product DROP FOREIGN KEY FK_product_category;
-- ALTER TABLE product DROP COLUMN category_id;

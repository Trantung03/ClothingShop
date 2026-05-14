-- Run once on an existing DB that still has product.category_id (many-to-one).
-- After this, Hibernate/JPA can map Product.categories via product_category.

CREATE TABLE IF NOT EXISTS product_category (
  product_id BIGINT NOT NULL,
  category_id BIGINT NOT NULL,
  PRIMARY KEY (product_id, category_id),
  CONSTRAINT fk_pc_product FOREIGN KEY (product_id) REFERENCES product (id),
  CONSTRAINT fk_pc_category FOREIGN KEY (category_id) REFERENCES category (id)
);

INSERT IGNORE INTO product_category (product_id, category_id)
SELECT id, category_id FROM product WHERE category_id IS NOT NULL;

ALTER TABLE product DROP FOREIGN KEY FK_product_category;
ALTER TABLE product DROP COLUMN category_id;

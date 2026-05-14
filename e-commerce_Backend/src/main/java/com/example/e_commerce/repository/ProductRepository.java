package com.example.e_commerce.repository;

import com.example.e_commerce.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    @Query(
            value = """
                    SELECT DISTINCT p
                    FROM Product p
                    LEFT JOIN p.categories cat
                    WHERE (:categoryId IS NULL OR cat.id = :categoryId)
                    AND (p.basePrice >= :minPrice OR :minPrice IS NULL)
                    AND (p.basePrice <= :maxPrice OR :maxPrice IS NULL)
                    AND (LOWER(p.name) LIKE LOWER(CONCAT('%', :search, '%')) OR :search IS NULL OR :search = '')
                    AND p.isActive = true
                    """,
            countQuery = """
                    SELECT COUNT(DISTINCT p)
                    FROM Product p
                    LEFT JOIN p.categories cat
                    WHERE (:categoryId IS NULL OR cat.id = :categoryId)
                    AND (p.basePrice >= :minPrice OR :minPrice IS NULL)
                    AND (p.basePrice <= :maxPrice OR :maxPrice IS NULL)
                    AND (LOWER(p.name) LIKE LOWER(CONCAT('%', :search, '%')) OR :search IS NULL OR :search = '')
                    AND p.isActive = true
                    """
    )
    Page<Product> findProductCatalog(
            @Param("categoryId") Long categoryId,
            @Param("minPrice") Long minPrice,
            @Param("maxPrice") Long maxPrice,
            @Param("search") String search,
            Pageable pageable
    );

    @Query(
            value = """
                    SELECT DISTINCT p
                    FROM Product p
                    JOIN p.categories cat
                    WHERE cat.id IN :categoryIds
                    AND (p.basePrice >= :minPrice OR :minPrice IS NULL)
                    AND (p.basePrice <= :maxPrice OR :maxPrice IS NULL)
                    AND (LOWER(p.name) LIKE LOWER(CONCAT('%', :search, '%')) OR :search IS NULL OR :search = '')
                    AND p.isActive = true
                    """,
            countQuery = """
                    SELECT COUNT(DISTINCT p)
                    FROM Product p
                    JOIN p.categories cat
                    WHERE cat.id IN :categoryIds
                    AND (p.basePrice >= :minPrice OR :minPrice IS NULL)
                    AND (p.basePrice <= :maxPrice OR :maxPrice IS NULL)
                    AND (LOWER(p.name) LIKE LOWER(CONCAT('%', :search, '%')) OR :search IS NULL OR :search = '')
                    AND p.isActive = true
                    """
    )
    Page<Product> findProductCatalogInCategoryIds(
            @Param("categoryIds") List<Long> categoryIds,
            @Param("minPrice") Long minPrice,
            @Param("maxPrice") Long maxPrice,
            @Param("search") String search,
            Pageable pageable
    );
}

package com.example.e_commerce.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.type.NumericBooleanConverter;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "product")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;
        
    @Column(columnDefinition = "LONGTEXT")
    private String description;
    private Long basePrice;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    @Column(nullable = false)
    private Boolean isActive;

    private LocalDateTime createdAt;

    private String imageUrl;

    // Nếu 1 sản phẩm có nhiều ảnh
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<ProductImage> images;
}

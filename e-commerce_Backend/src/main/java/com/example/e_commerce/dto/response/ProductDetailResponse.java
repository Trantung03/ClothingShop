package com.example.e_commerce.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class ProductDetailResponse {

    private Long productId;
    private String name;
    private String description;
    private String categoryName;
    private Long categoryId;
    private Long basePrice;
    private String imageUrl;

    private List<SkuResponse> skus;
}
package com.example.e_commerce.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class SkuResponse {
    private Long skuId;
    private Long productId;
    private String productName;
    private String productImageUrl;
    private String size;
    private String color;
    private Long price;
    private int stockAvailable;
}

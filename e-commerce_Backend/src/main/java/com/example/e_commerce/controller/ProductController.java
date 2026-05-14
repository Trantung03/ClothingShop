package com.example.e_commerce.controller;

import com.example.e_commerce.dto.response.ApiResponse;
import com.example.e_commerce.dto.response.ProductDetailResponse;
import com.example.e_commerce.dto.response.ProductImgResponse;
import com.example.e_commerce.dto.response.ProductListResponse;
import com.example.e_commerce.entity.ProductImage;
import com.example.e_commerce.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ProductController {

    private final ProductService productService;

    @GetMapping
    public ApiResponse<List<ProductListResponse>> getProducts(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) Long minPrice,
            @RequestParam(required = false) Long maxPrice,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        List<ProductListResponse> result = productService.getProducts(page, size, categoryId, minPrice, maxPrice, search);

        return ApiResponse.<List<ProductListResponse>>builder()
                .code(200)
                .message("Get products").result(result).build();
    }

    @GetMapping("/{id}")
    public ApiResponse<ProductDetailResponse> detail(@PathVariable Long id) {
        return ApiResponse.<ProductDetailResponse>builder()
                .code(200)
                .message("Get product detail").result(productService.getProductDetail(id)).build();
    }


}

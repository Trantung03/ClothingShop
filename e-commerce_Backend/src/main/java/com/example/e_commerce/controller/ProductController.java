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
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
@CrossOrigin(originPatterns = {"http://localhost:*", "http://127.0.0.1:*", "https://*.up.railway.app"}, allowCredentials = "true")
public class ProductController {

    private final ProductService productService;

    private static final Logger log = LoggerFactory.getLogger(ProductController.class);

    @GetMapping
    public ApiResponse<List<ProductListResponse>> getProducts(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) Long minPrice,
            @RequestParam(required = false) Long maxPrice,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        try {
            log.debug("getProducts called with page={} size={} categoryId={} minPrice={} maxPrice={} search={}", page, size, categoryId, minPrice, maxPrice, search);
            List<ProductListResponse> result = productService.getProducts(page, size, categoryId, minPrice, maxPrice, search);
            return ApiResponse.<List<ProductListResponse>>builder()
                    .code(200)
                    .message("Get products").result(result).build();
        } catch (Exception ex) {
            log.error("Exception in ProductController.getProducts", ex);
            throw ex;
        }
    }

    @GetMapping("/{id}")
    public ApiResponse<ProductDetailResponse> detail(@PathVariable Long id) {
        return ApiResponse.<ProductDetailResponse>builder()
                .code(200)
                .message("Get product detail").result(productService.getProductDetail(id)).build();
    }


}

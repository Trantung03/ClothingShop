package com.example.e_commerce.controller;

import com.example.e_commerce.dto.response.ApiResponse;
import com.example.e_commerce.dto.response.ProductImgResponse;
import com.example.e_commerce.service.ProductImgService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/img")
@RequiredArgsConstructor
@CrossOrigin(originPatterns = {"http://localhost:*", "http://127.0.0.1:*", "https://*.up.railway.app"}, allowCredentials = "true")
public class ProductImgController {

    private final ProductImgService productImgService;

    @GetMapping("/{id}")
    public ApiResponse<List<ProductImgResponse>> getProductPhotos(@PathVariable Long id) {
        List<ProductImgResponse> result = productImgService.getProductImgByProductId(id);
        return ApiResponse.<List<ProductImgResponse>>builder()
                .code(200)
                .message("Get product image list")
                .result(result).build();
    }

}

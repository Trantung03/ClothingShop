package com.example.e_commerce.controller;

import com.example.e_commerce.dto.response.ApiResponse;
import com.example.e_commerce.dto.response.CategoryResponse;
import com.example.e_commerce.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CategoryController {

    private final CategoryService categoryService;

    @GetMapping
    public ApiResponse<List<CategoryResponse>> getCategories() {
        List<CategoryResponse> result = categoryService.getAllCategories();
        return ApiResponse.<List<CategoryResponse>>builder()
                .code(200)
                .message("Get all categories")
                .result(result)
                .build();
    }
}

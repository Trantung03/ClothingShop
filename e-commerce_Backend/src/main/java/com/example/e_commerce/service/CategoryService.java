package com.example.e_commerce.service;

import com.example.e_commerce.dto.response.CategoryResponse;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface CategoryService {
    List<CategoryResponse> getAllCategories();
}

package com.example.e_commerce.service;

import com.example.e_commerce.dto.response.CategoryResponse;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface CategoryService {
    List<CategoryResponse> getAllCategories();

    /** Category gốc + mọi danh mục con (theo parent_id trong DB). */
    List<Long> getSelfAndDescendantCategoryIds(Long categoryId);
}

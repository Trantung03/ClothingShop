package com.example.e_commerce.service.impl;

import com.example.e_commerce.dto.response.CategoryResponse;
import com.example.e_commerce.entity.Category;
import com.example.e_commerce.repository.CategoryRepository;
import com.example.e_commerce.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;

    @Override
    public List<CategoryResponse> getAllCategories() {
        List<Category> categories = categoryRepository.findAll();

        Map<Long, CategoryResponse> responseMap = categories.stream()
                .map(category -> CategoryResponse.builder()
                        .categoryId(category.getId())
                        .name(category.getName())
                        .build())
                .collect(Collectors.toMap(CategoryResponse::getCategoryId, categoryResponse -> categoryResponse));

        List<CategoryResponse> roots = new ArrayList<>();

        for (Category category : categories) {
            CategoryResponse response = responseMap.get(category.getId());
            if (category.getParent() == null) {
                roots.add(response);
            } else {
                CategoryResponse parentResponse = responseMap.get(category.getParent().getId());
                if (parentResponse != null) {
                    parentResponse.getChildren().add(response);
                }
            }
        }

        return roots;
    }
}

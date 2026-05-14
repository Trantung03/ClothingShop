package com.example.e_commerce.service.impl;

import com.example.e_commerce.dto.response.CategoryResponse;
import com.example.e_commerce.entity.Category;
import com.example.e_commerce.repository.CategoryRepository;
import com.example.e_commerce.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.HashMap;
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

    @Override
    public List<Long> getSelfAndDescendantCategoryIds(Long categoryId) {
        if (categoryId == null) {
            return List.of();
        }
        List<Category> all = categoryRepository.findAll();
        Map<Long, List<Long>> childrenByParent = new HashMap<>();
        for (Category c : all) {
            if (c.getParent() == null) {
                continue;
            }
            Long pid = c.getParent().getId();
            childrenByParent.computeIfAbsent(pid, k -> new ArrayList<>()).add(c.getId());
        }
        List<Long> out = new ArrayList<>();
        ArrayDeque<Long> queue = new ArrayDeque<>();
        queue.add(categoryId);
        while (!queue.isEmpty()) {
            Long id = queue.poll();
            out.add(id);
            for (Long childId : childrenByParent.getOrDefault(id, List.of())) {
                queue.add(childId);
            }
        }
        return out;
    }
}

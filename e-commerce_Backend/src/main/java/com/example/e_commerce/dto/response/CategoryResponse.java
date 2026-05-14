package com.example.e_commerce.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CategoryResponse {
    private Long categoryId;
    private String name;

    @Builder.Default
    private List<CategoryResponse> children = new ArrayList<>();
}

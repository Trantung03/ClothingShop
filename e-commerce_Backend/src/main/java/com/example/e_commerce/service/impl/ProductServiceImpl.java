package com.example.e_commerce.service.impl;

import com.example.e_commerce.dto.response.CategoryBriefResponse;
import com.example.e_commerce.dto.response.ProductDetailResponse;
import com.example.e_commerce.dto.response.ProductListResponse;
import com.example.e_commerce.dto.response.SkuResponse;
import com.example.e_commerce.entity.Category;
import com.example.e_commerce.entity.Product;
import com.example.e_commerce.entity.Sku;
import com.example.e_commerce.exception.AppException;
import com.example.e_commerce.exception.ErrorCode;
import com.example.e_commerce.repository.ProductRepository;
import com.example.e_commerce.repository.SkuRepository;
import com.example.e_commerce.service.CategoryService;
import com.example.e_commerce.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;


@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;

    private final SkuRepository skuRepository;

    private final CategoryService categoryService;

    @Override
    @Transactional(readOnly = true)
    public List<ProductListResponse> getProducts(int page, int size, Long categoryId, Long minPrice, Long maxPrice, String search) {
        PageRequest pageable = PageRequest.of(page, size);
        Page<Product> productPage;
        if (categoryId == null) {
            productPage = productRepository.findProductCatalog(null, minPrice, maxPrice, search, pageable);
        } else {
            List<Long> categoryIds = categoryService.getSelfAndDescendantCategoryIds(categoryId);
            productPage = productRepository.findProductCatalogInCategoryIds(categoryIds, minPrice, maxPrice, search, pageable);
        }
        return productPage.stream().map(this::toProductListResponse).toList();
    }

    private ProductListResponse toProductListResponse(Product p) {
        List<CategoryBriefResponse> categoryBriefs = mapCategories(p.getCategories());
        return ProductListResponse.builder().productId(p.getId())
                .name(p.getName())
                .categoryName(joinCategoryNames(p.getCategories()))
                .categoryId(primaryCategoryId(p.getCategories()))
                .categories(categoryBriefs)
                .price(p.getBasePrice())
                .imageUrl(p.getImageUrl()).build();
    }

    @Override
    @Transactional(readOnly = true)
    public ProductDetailResponse getProductDetail(Long productId) {

        Product p = productRepository.findById(productId).orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));

        List<Sku> skuList = skuRepository.findByProduct_Id(productId);

        List<SkuResponse> skuResponseList = skuList.stream().map(sku -> SkuResponse.builder().skuId(sku.getId())
                .productId(p.getId())
                .productName(p.getName())
                .productImageUrl(p.getImageUrl())
                .size(sku.getSize())
                .color(sku.getColor())
                .price(sku.getPrice())
                .stockAvailable(sku.getStockAvailable())
                .build()).toList();

        return ProductDetailResponse.builder().productId(p.getId())
                .name(p.getName())
                .description(p.getDescription())
                .categoryName(joinCategoryNames(p.getCategories()))
                .categoryId(primaryCategoryId(p.getCategories()))
                .categories(mapCategories(p.getCategories()))
                .basePrice(p.getBasePrice())
                .imageUrl(p.getImageUrl())
                .skus(skuResponseList).build();
    }

    private static List<CategoryBriefResponse> mapCategories(Set<Category> categories) {
        if (categories == null || categories.isEmpty()) {
            return List.of();
        }
        return categories.stream()
                .sorted(Comparator.comparing(Category::getId))
                .map(c -> CategoryBriefResponse.builder()
                        .categoryId(c.getId())
                        .name(c.getName())
                        .build())
                .toList();
    }

    private static String joinCategoryNames(Set<Category> categories) {
        if (categories == null || categories.isEmpty()) {
            return "No category";
        }
        return categories.stream()
                .sorted(Comparator.comparing(Category::getId))
                .map(Category::getName)
                .collect(Collectors.joining(", "));
    }

    private static Long primaryCategoryId(Set<Category> categories) {
        if (categories == null || categories.isEmpty()) {
            return null;
        }
        return categories.stream()
                .map(Category::getId)
                .min(Long::compareTo)
                .orElse(null);
    }

}

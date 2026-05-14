package com.example.e_commerce.service.impl;

import com.example.e_commerce.dto.response.ProductImgResponse;
import com.example.e_commerce.entity.ProductImage;
import com.example.e_commerce.repository.ProductImgRepository;
import com.example.e_commerce.service.ProductImgService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductImgServiceImpl implements ProductImgService {

    private final ProductImgRepository productImgRepository;
    @Override
    public List<ProductImgResponse> getProductImgByProductId(Long productId) {

        List<ProductImage> productImgList =productImgRepository.findByProductId(productId);
        List<ProductImgResponse> productImgResponseList = productImgList.stream()
                .map( productImage -> ProductImgResponse.builder()
                        .imageUrl(productImage.getImageUrl())
                        .productId(productImage.getProduct().getId())
                        .build())
                .toList();
        return productImgResponseList;
    }
}

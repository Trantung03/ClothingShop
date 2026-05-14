package com.example.e_commerce.service;

import com.example.e_commerce.dto.response.ProductImgResponse;
import com.example.e_commerce.dto.response.ProductListResponse;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface ProductImgService {
    List<ProductImgResponse> getProductImgByProductId(Long productId);

}

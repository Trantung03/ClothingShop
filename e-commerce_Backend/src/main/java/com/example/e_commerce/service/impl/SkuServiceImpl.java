package com.example.e_commerce.service.impl;

import com.example.e_commerce.dto.response.SkuResponse;
import com.example.e_commerce.entity.ProductImage;
import com.example.e_commerce.entity.Sku;
import com.example.e_commerce.exception.AppException;
import com.example.e_commerce.exception.ErrorCode;
import com.example.e_commerce.repository.ProductImgRepository;
import com.example.e_commerce.repository.SkuRepository;
import com.example.e_commerce.service.SkuService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SkuServiceImpl implements SkuService {

    private final SkuRepository skuRepository;
    private final ProductImgRepository productImgRepository;

    @Override
    public SkuResponse getSkuDetail(Long id) {

        Sku sku = skuRepository.findById(id).orElseThrow(()-> new AppException(ErrorCode.SKU_NOT_FOUND));

        String productImageUrl = resolveProductImageUrl(sku);

        return SkuResponse.builder()
                .skuId(sku.getId())
                .productId(sku.getProduct().getId())
                .productName(sku.getProduct().getName())
                .productImageUrl(productImageUrl)
                .size(sku.getSize())
                .color(sku.getColor())
                .price(sku.getPrice())
                .stockAvailable(sku.getStockAvailable()).build();
    }

    private String resolveProductImageUrl(Sku sku) {
        String main = sku.getProduct().getImageUrl();
        if (StringUtils.hasText(main)) {
            return main.trim();
        }
        List<ProductImage> extras = productImgRepository.findByProduct_Id(sku.getProduct().getId());
        if (extras != null && !extras.isEmpty()) {
            String u = extras.get(0).getImageUrl();
            if (StringUtils.hasText(u)) {
                return u.trim();
            }
        }
        return null;
    }
}

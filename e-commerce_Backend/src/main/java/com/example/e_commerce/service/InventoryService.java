package com.example.e_commerce.service;

import com.example.e_commerce.entity.InventoryReservation;
import org.springframework.stereotype.Service;

@Service
public interface InventoryService {

    InventoryReservation reserveStock(Long skuId, int quantity, String sessionId);
    void releaseStock(Long skuId, int quantity, String sessionId);
    void confirmStock(String sessionId);
    void cleanupExpiredReservations();
}

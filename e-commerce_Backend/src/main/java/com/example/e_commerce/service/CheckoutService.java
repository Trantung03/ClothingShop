package com.example.e_commerce.service;

import com.example.e_commerce.dto.response.CheckoutPrepareResponse;
import org.springframework.stereotype.Service;

@Service
public interface CheckoutService {
    CheckoutPrepareResponse prepareCheckout(String sessionId);
    boolean verifyReservation(String reservationSessionId);
}

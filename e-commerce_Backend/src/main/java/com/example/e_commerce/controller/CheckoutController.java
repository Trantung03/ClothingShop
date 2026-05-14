package com.example.e_commerce.controller;

import com.example.e_commerce.dto.response.ApiResponse;
import com.example.e_commerce.dto.response.CheckoutPrepareResponse;
import com.example.e_commerce.service.impl.CheckoutServiceImpl;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/checkout")
@RequiredArgsConstructor
public class CheckoutController {

    private final CheckoutServiceImpl checkoutService;

    @PostMapping
    public ApiResponse<CheckoutPrepareResponse> prepareCheckout(
            HttpSession session) {

        String sessionId = session.getId();

        CheckoutPrepareResponse response = checkoutService.prepareCheckout( sessionId);
        return ApiResponse.<CheckoutPrepareResponse>builder().code(200)
                .message("prepare checkout")
        .result(response).build();
    }

    @GetMapping("/verify/{sessionId}")
    public ApiResponse<Boolean> verifyReservation(@PathVariable String sessionId) {
        boolean isValid = checkoutService.verifyReservation(sessionId);
        return ApiResponse.<Boolean>builder().code(200)
                .message("verify reservation")
        .result(isValid).build();
    }

}

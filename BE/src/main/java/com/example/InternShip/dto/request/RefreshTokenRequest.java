package com.example.InternShip.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class RefreshTokenRequest {
    @NotBlank(message = "REFRESH_TOKEN_INVALID")
    private String refreshToken;
}

package com.example.InternShip.dto.request;

import lombok.Data;

@Data
public class GetAllUserRequest {
    private String keyword;
    private String role;
    private int page;
}

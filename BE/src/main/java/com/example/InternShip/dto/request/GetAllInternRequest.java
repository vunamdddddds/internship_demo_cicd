package com.example.InternShip.dto.request;

import lombok.Data;

@Data
public class GetAllInternRequest {
    private String keyWord;
    private Integer universityId;
    private Integer majorId;
    private int page;
}

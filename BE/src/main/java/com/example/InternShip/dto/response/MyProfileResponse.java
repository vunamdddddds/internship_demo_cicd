package com.example.InternShip.dto.response;

import lombok.Data;

@Data
public class MyProfileResponse {
    private GetInternResponse internDetails;
    private TeamDetailResponse teamDetails;
}

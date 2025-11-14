package com.example.InternShip.dto.response;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class GetAllTeamResponse {
    private Integer id;
    private String name;
    private String internshipProgramName;
}

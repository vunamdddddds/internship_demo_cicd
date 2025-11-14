package com.example.InternShip.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class GetTeamResponse {
    private Integer id;
    private String name;
    private String internshipProgramName;
    private String mentorName;
    private int totalIntern;
}

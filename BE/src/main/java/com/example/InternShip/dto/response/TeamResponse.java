package com.example.InternShip.dto.response;

import lombok.Data;

import java.util.List;

@Data
public class TeamResponse {
    private Integer id;
    private String name;
    private List<TeamMemberResponse> members;
}

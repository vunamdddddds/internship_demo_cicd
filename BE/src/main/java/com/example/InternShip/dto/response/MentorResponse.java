package com.example.InternShip.dto.response;

import lombok.Data;

@Data
public class MentorResponse {
    private Integer mentorId;
    private String fullName;
    private String email;
    private String phone;
    private String address;
    private String departmentName;
}
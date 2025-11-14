package com.example.InternShip.dto.request;
import com.example.InternShip.entity.InternshipApplication;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class GetAllApplicationRequest {
    private String university;
    private String major;
    private String applicantName;
    private InternshipApplication.Status status;
}
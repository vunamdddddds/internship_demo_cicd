package com.example.InternShip.dto.response;

import com.example.InternShip.entity.Intern;
import lombok.Data;

@Data
public class InternResponse {
    private int internId;
    private String fullName;
    private String email;
    private String phone;
    private String majorName;
    private String universityName;
    private Intern.Status status;
}

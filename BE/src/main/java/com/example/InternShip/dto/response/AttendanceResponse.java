package com.example.InternShip.dto.response;

import lombok.Data;
import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class AttendanceResponse {
    private Integer id;
    private String internName;
    private String teamName;
    private LocalDate date;

    // Giờ làm việc dự kiến
    private LocalTime expectedTimeStart;
    private LocalTime expectedTimeEnd;

    // Giờ làm việc thực tế
    private LocalTime checkIn;
    private LocalTime checkOut;

    private String status;
}
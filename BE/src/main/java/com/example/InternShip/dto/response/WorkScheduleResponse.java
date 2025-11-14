package com.example.InternShip.dto.response;

import lombok.Data;

import java.time.DayOfWeek;
import java.time.LocalTime;

@Data
public class WorkScheduleResponse {
    private Integer id;
    private DayOfWeek dayOfWeek;
    private LocalTime timeStart;
    private LocalTime timeEnd;
    private String teamName;
}

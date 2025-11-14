package com.example.InternShip.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.DayOfWeek;
import java.time.LocalTime;
import java.util.List;

@Data
public class SetWorkScheduleRequest {

    @NotNull
    private List<WorkScheduleItem> schedules;

    @Data
    public static class WorkScheduleItem {
        @NotNull
        private DayOfWeek dayOfWeek;

        @NotNull
        private LocalTime timeStart;

        @NotNull
        private LocalTime timeEnd;
    }
}

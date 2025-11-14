package com.example.InternShip.dto.response;

import lombok.Data;
import java.util.List;

@Data
public class InternAttendanceDetailResponse {

    private Integer internId;
    private String fullName;
    private String email;
    private String teamName;

    private AttendanceSummary summary;

    private List<DailyLogEntry> dailyLogs;

    @Data
    public static class AttendanceSummary {
        private long totalWorkingDays;
        private long totalOnLeaveDays;
        private long totalAbsentDays;
    }

    @Data
    public static class DailyLogEntry {
        private java.time.LocalDate date;
        private java.time.LocalTime expectedTimeStart;
        private java.time.LocalTime expectedTimeEnd;
        private java.time.LocalTime actualCheckIn;
        private java.time.LocalTime actualCheckOut;
        private String status;
    }
}
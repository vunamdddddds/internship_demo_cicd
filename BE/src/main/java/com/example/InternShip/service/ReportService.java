package com.example.InternShip.service;

import com.example.InternShip.dto.response.AttendanceSummaryResponse;
import com.example.InternShip.dto.response.InternAttendanceDetailResponse;

import java.time.LocalDate;
import java.util.List;

public interface ReportService {
    List<AttendanceSummaryResponse> getAttendanceSummaryReport(LocalDate startDate, LocalDate endDate, Integer teamId);

    InternAttendanceDetailResponse getInternAttendanceDetail(Integer internId, LocalDate startDate, LocalDate endDate);
}
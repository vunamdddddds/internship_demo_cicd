package com.example.InternShip.service.impl;

import com.example.InternShip.dto.response.AttendanceSummaryResponse;
import com.example.InternShip.dto.response.InternAttendanceDetailResponse;
import com.example.InternShip.entity.Attendance;
import com.example.InternShip.entity.Intern;
import com.example.InternShip.exception.ErrorCode;
import com.example.InternShip.repository.AttendanceRepository;
import com.example.InternShip.repository.InternRepository;
import com.example.InternShip.service.ReportService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReportServiceImpl implements ReportService {

    private final AttendanceRepository attendanceRepository;
    private final InternRepository internRepository;

    @Override
    public List<AttendanceSummaryResponse> getAttendanceSummaryReport(LocalDate startDate, LocalDate endDate, Integer teamId) {

        //Lấy dữ liệu tổng hợp từ csdl
        List<AttendanceRepository.AttendanceSummaryProjection> projections = attendanceRepository.getAttendanceSummary(startDate, endDate, teamId);

        //Lấy danh sách ID các Intern liên quan
        List<Integer> internIds = projections.stream()
                .map(AttendanceRepository.AttendanceSummaryProjection::getInternId)
                .collect(Collectors.toList());

        if (internIds.isEmpty()) {
            return new ArrayList<>();
        }

        //Lấy thông tin chi tiết (Tên, Email, Nhóm) của các Intern này
        Map<Integer, Intern> internMap = internRepository.findAllById(internIds).stream()
                .collect(Collectors.toMap(Intern::getId, Function.identity()));

        //Kết hợp dữ liệu và trả về
        return projections.stream().map(p -> {
            Intern intern = internMap.get(p.getInternId());

            AttendanceSummaryResponse res = new AttendanceSummaryResponse();
            res.setInternId(intern.getId());
            res.setFullName(intern.getUser().getFullName());
            res.setEmail(intern.getUser().getEmail());
            res.setTeamName(intern.getTeam() != null ? intern.getTeam().getName() : ErrorCode.INTERN_NOT_IN_TEAM.getMessage());

            res.setTotalWorkingDays(p.getTotalWorkingDays());
            res.setTotalOnLeaveDays(p.getTotalOnLeaveDays());
            res.setTotalAbsentDays(p.getTotalAbsentDays());

            return res;
        }).collect(Collectors.toList());
    }

    @Override
    public InternAttendanceDetailResponse getInternAttendanceDetail(Integer internId, LocalDate startDate, LocalDate endDate) {
        Intern intern = internRepository.findById(internId)
                .orElseThrow(() -> new EntityNotFoundException(ErrorCode.INTERN_NOT_FOUND.getMessage()));
        List<Attendance> attendanceLogs = attendanceRepository.findByInternAndDateBetweenOrderByDateAsc(intern, startDate, endDate);

        long working = 0, onLeave = 0, absent = 0;
        for (Attendance log : attendanceLogs) {
            switch (log.getStatus()) {
                case PRESENT, LATE, EARLY_LEAVE, LATE_AND_EARLY_LEAVE:
                    working++;
                    break;
                case ON_LEAVE:
                    onLeave++;
                    break;
                case ABSENT:
                    absent++;
                    break;
                default:
                    break;
            }
        }
        InternAttendanceDetailResponse.AttendanceSummary summary = new InternAttendanceDetailResponse.AttendanceSummary();
        summary.setTotalWorkingDays(working);
        summary.setTotalOnLeaveDays(onLeave);
        summary.setTotalAbsentDays(absent);

        List<InternAttendanceDetailResponse.DailyLogEntry> dailyLogs = attendanceLogs.stream()
                .map(log -> {
                    InternAttendanceDetailResponse.DailyLogEntry entry = new InternAttendanceDetailResponse.DailyLogEntry();
                    entry.setDate(log.getDate());
                    entry.setExpectedTimeStart(log.getTimeStart());
                    entry.setExpectedTimeEnd(log.getTimeEnd());
                    entry.setActualCheckIn(log.getCheckIn());
                    entry.setActualCheckOut(log.getCheckOut());
                    entry.setStatus(log.getStatus().name());
                    return entry;
                }).collect(Collectors.toList());

        InternAttendanceDetailResponse response = new InternAttendanceDetailResponse();
        response.setInternId(intern.getId());
        response.setFullName(intern.getUser().getFullName());
        response.setEmail(intern.getUser().getEmail());
        response.setTeamName(intern.getTeam() != null ? intern.getTeam().getName() : ErrorCode.INTERN_NOT_IN_TEAM.getMessage());
        response.setSummary(summary);
        response.setDailyLogs(dailyLogs);

        return response;
    }
}
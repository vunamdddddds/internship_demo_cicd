package com.example.InternShip.service;

import com.example.InternShip.dto.response.GetAllAttendanceResponse;
import com.example.InternShip.dto.response.GetMyScheduleResponse;
import com.example.InternShip.dto.response.GetTeamScheduleResponse;

import java.util.List;

public interface AttendanceService {
    GetMyScheduleResponse checkIn();

    GetMyScheduleResponse checkOut();

    List<GetMyScheduleResponse> getMySchedule();

    List<GetTeamScheduleResponse> getTeamSchedule(int teamId);

    List<GetAllAttendanceResponse> getInternsAttendance();

}

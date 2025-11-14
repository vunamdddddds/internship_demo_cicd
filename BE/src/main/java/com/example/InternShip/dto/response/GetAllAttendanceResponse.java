package com.example.InternShip.dto.response;

public interface GetAllAttendanceResponse {
    Integer getInternId();
    String getInternName();
    String getTeamName();
    Integer getPresentDay();
    Integer getAbsentDay();
    Integer getLateAndLeaveDay();
}

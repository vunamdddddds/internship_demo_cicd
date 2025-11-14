package com.example.InternShip.service;

import java.util.List;

import com.example.InternShip.dto.request.CreateSprintRequest;
import com.example.InternShip.dto.request.UpdateSprintRequest;
import com.example.InternShip.dto.response.PagedResponse;
import com.example.InternShip.dto.response.SprintResponse;

public interface SprintService {
    SprintResponse createSprint(Integer teamId, CreateSprintRequest request);
    SprintResponse updateSprint(Long sprintId, UpdateSprintRequest request);
    void deleteSprint(Long sprintId);
    List<SprintResponse> getSprintsByTeam(Integer teamId);
    SprintResponse getSprintById(Long sprintId);
}

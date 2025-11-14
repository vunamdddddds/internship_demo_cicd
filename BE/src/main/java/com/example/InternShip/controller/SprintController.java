package com.example.InternShip.controller;

import com.example.InternShip.dto.request.CreateSprintRequest;
import com.example.InternShip.dto.request.UpdateSprintRequest;
import com.example.InternShip.dto.response.ApiResponse;
import com.example.InternShip.dto.response.SprintResponse;
import com.example.InternShip.service.SprintService;
import lombok.RequiredArgsConstructor;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class SprintController {

    private final SprintService sprintService;

    @PostMapping("/teams/{teamId}/sprints")
    public ResponseEntity<ApiResponse> createSprint(@PathVariable Integer teamId, @RequestBody CreateSprintRequest request) {
        SprintResponse sprintResponse = sprintService.createSprint(teamId, request);
        ApiResponse response = new ApiResponse(HttpStatus.CREATED.value(), "Sprint created successfully", sprintResponse);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/teams/{teamId}/sprints")
    public ResponseEntity<ApiResponse> getSprintsByTeam(@PathVariable Integer teamId) {
        List<SprintResponse> sprints = sprintService.getSprintsByTeam(teamId);
        ApiResponse response = new ApiResponse(HttpStatus.OK.value(), "Sprints retrieved successfully", sprints);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/sprints/{sprintId}")
    public ResponseEntity<ApiResponse> getSprintById(@PathVariable Long sprintId) {
        SprintResponse sprintResponse = sprintService.getSprintById(sprintId);
        ApiResponse response = new ApiResponse(HttpStatus.OK.value(), "Sprint retrieved successfully", sprintResponse);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PutMapping("/sprints/{sprintId}")
    public ResponseEntity<ApiResponse> updateSprint(@PathVariable Long sprintId, @RequestBody UpdateSprintRequest request) {
        SprintResponse sprintResponse = sprintService.updateSprint(sprintId, request);
        ApiResponse response = new ApiResponse(HttpStatus.OK.value(), "Sprint updated successfully", sprintResponse);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @DeleteMapping("/sprints/{sprintId}")
    public ResponseEntity<ApiResponse> deleteSprint(@PathVariable Long sprintId) {
        sprintService.deleteSprint(sprintId);
        ApiResponse response = new ApiResponse(HttpStatus.OK.value(), "Sprint deleted successfully", null);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}

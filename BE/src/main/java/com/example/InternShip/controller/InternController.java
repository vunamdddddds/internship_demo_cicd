package com.example.InternShip.controller;

import com.example.InternShip.dto.request.UpdateInternRequest;

import com.example.InternShip.dto.request.CreateInternRequest;

import com.example.InternShip.dto.request.GetAllInternRequest;
import com.example.InternShip.dto.response.GetInternResponse;
import com.example.InternShip.dto.response.PagedResponse;

import com.example.InternShip.service.InternService;
import com.example.InternShip.service.WorkScheduleService; // Added
import com.example.InternShip.dto.response.WorkScheduleResponse; // Added
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;


import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import org.springframework.web.bind.annotation.GetMapping;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PutMapping;

import org.springframework.web.bind.annotation.PathVariable;

import java.util.List; // Added

import com.example.InternShip.dto.response.MyProfileResponse;
import org.springframework.security.access.prepost.PreAuthorize;

@RestController
@RequestMapping("/api/v1/interns")
@RequiredArgsConstructor
public class InternController {
    private final InternService internService;
    private final WorkScheduleService workScheduleService; // Added

    @GetMapping("/me")
    @PreAuthorize("hasAuthority('SCOPE_INTERN')")
    public ResponseEntity<MyProfileResponse> getMyProfile() {
        return ResponseEntity.ok(internService.getMyProfile());
    }

    @PutMapping("/{id}")
    public ResponseEntity<GetInternResponse> UpdateInternById(@PathVariable Integer id, @RequestBody @Valid UpdateInternRequest updateInternRequest) {
        return ResponseEntity.ok(internService.updateIntern(id, updateInternRequest));
    }

    @PostMapping
    public ResponseEntity<GetInternResponse> createIntern(@Valid @RequestBody CreateInternRequest request) {
        return ResponseEntity.ok(internService.createIntern(request));
    }

    @GetMapping
    public ResponseEntity<PagedResponse<GetInternResponse>> getAllIntern (GetAllInternRequest request){
        return ResponseEntity.ok(internService.getAllIntern(request));
    }

    @GetMapping("/{teamId}") // Hàm lấy ra danh sách intern chưa có nhóm, status ACTIVE, và có kỳ thực tập trùng với nhóm
    public ResponseEntity<?> getAllInternNoTeam(@PathVariable Integer teamId){
        return ResponseEntity.ok(internService.getAllInternNoTeam(teamId));
    }

    @GetMapping("/my-team-schedule") // New endpoint
    public ResponseEntity<List<WorkScheduleResponse>> getMyTeamSchedule() {
        Integer internTeamId = internService.getAuthenticatedInternTeamId();

        if (internTeamId == null) {
            // If the intern is not associated with a team or not found, return 404 Not Found
            // Or 403 Forbidden, depending on desired error handling
            return ResponseEntity.notFound().build();
        }

        List<WorkScheduleResponse> teamSchedule = workScheduleService.getWorkSchedule(internTeamId);
        return ResponseEntity.ok(teamSchedule);
    }
}

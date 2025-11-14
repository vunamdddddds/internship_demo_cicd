package com.example.InternShip.controller;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.InternShip.dto.request.CreateLeaveApplicationRequest;
import com.example.InternShip.dto.request.RejectLeaveApplicationRequest;
import com.example.InternShip.service.LeaveRequestService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/leaveRequests")
@RequiredArgsConstructor
public class LeaveRequestController {
    private final LeaveRequestService leaveRequestService;

    @PostMapping(consumes = "multipart/form-data")
    public ResponseEntity<Void> createLeaveRequest(@ModelAttribute @Valid CreateLeaveApplicationRequest request) {
        leaveRequestService.createLeaveRequest(request);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/me") // Get cho intern
    public ResponseEntity<?> getAllLeaveApplicationByIntern() {
        return ResponseEntity.ok(leaveRequestService.getAllLeaveApplicationByIntern());
    }

    @GetMapping // Get cho riêng hr
    public ResponseEntity<?> getAllLeaveApplication(
            @RequestParam(required = false, defaultValue = "") Boolean approved, // trạng thái
            @RequestParam(required = false, defaultValue = "") String keyword, // internName
            @RequestParam(required = false, defaultValue = "") String type, // loại đơn
            @RequestParam(required = false, defaultValue = "1") int page,
            @RequestParam(required = false, defaultValue = "10") int size) {

        return ResponseEntity.ok(leaveRequestService.getAllLeaveApplication(
                approved,
                keyword,
                type,
                page,
                size));
    }

    @GetMapping("/{id}") // Xem 1 cái
    public ResponseEntity<?> viewLeaveApplication(@PathVariable Integer id) {
        return ResponseEntity.ok(leaveRequestService.viewLeaveApplication(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> cancelLeaveApplication(@PathVariable Integer id) {
        leaveRequestService.cancelLeaveApplication(id);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/approve/{id}")
    public ResponseEntity<?> approveLeaveAppication(@PathVariable Integer id) {
        leaveRequestService.approveLeaveAppication(id);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/reject")
    public ResponseEntity<?> rejectLeaveAppication(@RequestBody @Valid RejectLeaveApplicationRequest request) {
        leaveRequestService.rejectLeaveAppication(request);
        return ResponseEntity.ok().build();
    }
}

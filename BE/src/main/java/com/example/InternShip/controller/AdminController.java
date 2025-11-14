package com.example.InternShip.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.InternShip.dto.response.ApiResponse;
import com.example.InternShip.service.AdminService;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PathVariable;

@RestController
@RequestMapping("/api/v1/admins")
@RequiredArgsConstructor
@PreAuthorize("hasAuthority('SCOPE_ADMIN') ")
public class AdminController {

    private final AdminService adminService;

    @PutMapping("/banUser/{id}")
    public ResponseEntity<ApiResponse<String>> banUser(@PathVariable int id) {

        adminService.banUser(id);
        return ResponseEntity.ok().body(new ApiResponse<>(200, "ban người dùng có id " + id + " thành công", null));
    }

    @PutMapping("/unBanUser/{id}")
    public ResponseEntity<ApiResponse<String>> unBanUser(@PathVariable int id) {
        adminService.unBanUser(id);
        return ResponseEntity.ok().body(new ApiResponse<>(200, "UnBan người dùng có id " + id + "thành công", null));
    }

}

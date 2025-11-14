package com.example.InternShip.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDate;

import org.springframework.web.multipart.MultipartFile;

@Data
public class CreateLeaveApplicationRequest {
    @NotNull(message = "TYPE_NOT_NULL")
    private String type;

    @NotNull(message = "DATE_LEAVE_NOT_NULL")
    private LocalDate date;

    @Size(min = 20, message = "Lý do quá ngắn")
    @NotNull(message = "REASON_NOT_NULL")
    private String reason;

    private MultipartFile attachedFile;


}

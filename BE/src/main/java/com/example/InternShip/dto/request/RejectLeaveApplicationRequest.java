package com.example.InternShip.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class RejectLeaveApplicationRequest {
    @NotNull(message = "ID_NOT_NULL")
    private int id;

    @NotNull(message = "REASON_REJECT_NOT_NULL")
    private String reasonReject;
}

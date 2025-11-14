package com.example.InternShip.dto.request;

import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

import java.util.Set;

@Data
public class AddMemberRequest {
    @NotEmpty(message = "LIST_INTERN_INVALID")
    Set<Integer> internIds;
}
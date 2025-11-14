package com.example.InternShip.controller;

import com.example.InternShip.dto.request.CreateTaskRequest;
import com.example.InternShip.dto.request.UpdateTaskRequest;
import com.example.InternShip.dto.response.ApiResponse;
import com.example.InternShip.dto.response.TaskResponse;
import com.example.InternShip.service.TaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.InternShip.dto.request.BatchTaskUpdateRequest;

import com.example.InternShip.entity.enums.TaskStatus;

import java.util.List;

import jakarta.validation.Valid;



@RestController

@RequestMapping("/api/v1")

@RequiredArgsConstructor

public class TaskController {



    private final TaskService taskService;



    @GetMapping("/teams/{teamId}/tasks")

    public ResponseEntity<ApiResponse> getTasksByTeam(@PathVariable String teamId) {

        List<TaskResponse> tasks = taskService.getTasksByTeam(teamId);

        ApiResponse response = new ApiResponse(HttpStatus.OK.value(), "Tasks for team retrieved successfully", tasks);

        return new ResponseEntity<>(response, HttpStatus.OK);

    }





    @PostMapping("/sprints/{sprintId}/tasks")

    public ResponseEntity<ApiResponse> createTask(@PathVariable Long sprintId, @RequestBody @Valid CreateTaskRequest request) {

        request.setSprintId(sprintId);

        TaskResponse taskResponse = taskService.createTask(request);

        ApiResponse response = new ApiResponse(HttpStatus.CREATED.value(), "Task created successfully", taskResponse);

        return new ResponseEntity<>(response, HttpStatus.CREATED);

    }

    @GetMapping("/sprints/{sprintId}/tasks")
    public ResponseEntity<ApiResponse> getTasksBySprint(
            @PathVariable Long sprintId,
            @RequestParam(required = false) TaskStatus status,
            @RequestParam(required = false) Integer assigneeId) {
        List<TaskResponse> tasks = taskService.getTasksBySprint(sprintId, status, assigneeId);
        ApiResponse response = new ApiResponse(HttpStatus.OK.value(), "Tasks retrieved successfully", tasks);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/assignees/{assigneeId}/tasks")
    public ResponseEntity<ApiResponse> getTasksByAssignee(@PathVariable Integer assigneeId) {
        List<TaskResponse> tasks = taskService.getTasksByAssignee(assigneeId);
        ApiResponse response = new ApiResponse(HttpStatus.OK.value(), "Tasks retrieved successfully", tasks);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PutMapping("/tasks/{taskId}")
    public ResponseEntity<ApiResponse> updateTask(@PathVariable Long taskId, @RequestBody UpdateTaskRequest request) {
        TaskResponse taskResponse = taskService.updateTask(taskId, request);
        ApiResponse response = new ApiResponse(HttpStatus.OK.value(), "Task updated successfully", taskResponse);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @DeleteMapping("/tasks/{taskId}")
    public ResponseEntity<ApiResponse> deleteTask(@PathVariable Long taskId) {
        taskService.deleteTask(taskId);
        ApiResponse response = new ApiResponse(HttpStatus.OK.value(), "Task deleted successfully", null);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/tasks/{taskId}")
    public ResponseEntity<ApiResponse> getTaskById(@PathVariable Long taskId) {
        TaskResponse taskResponse = taskService.getTaskById(taskId);
        ApiResponse response = new ApiResponse(HttpStatus.OK.value(), "Task retrieved successfully", taskResponse);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PostMapping("/tasks/batch-update")
    public ResponseEntity<ApiResponse> batchUpdateTasks(@RequestBody @Valid BatchTaskUpdateRequest request) {
        taskService.batchUpdateTasks(request);
        ApiResponse response = new ApiResponse(HttpStatus.OK.value(), "Tasks updated successfully", null);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}

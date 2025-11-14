package com.example.InternShip.service;

import com.example.InternShip.dto.request.CreateTaskRequest;
import com.example.InternShip.dto.request.UpdateTaskRequest;
import com.example.InternShip.dto.response.TaskResponse;
import com.example.InternShip.dto.request.BatchTaskUpdateRequest;
import com.example.InternShip.entity.enums.TaskStatus;

import java.util.List;

public interface TaskService {
    TaskResponse createTask(CreateTaskRequest request);

    TaskResponse updateTask(Long taskId, UpdateTaskRequest request);

    TaskResponse getTaskById(Long taskId);

    void deleteTask(Long taskId);

    void batchUpdateTasks(BatchTaskUpdateRequest request);

List<TaskResponse> getTasksBySprint(Long sprintId, TaskStatus status, Integer assigneeId);

    List<TaskResponse> getTasksByTeam(String teamId);

    List<TaskResponse> getTasksByAssignee(Integer assigneeId);
}

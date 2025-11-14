package com.example.InternShip.service.impl;

import com.example.InternShip.dto.request.CreateTaskRequest;
import com.example.InternShip.dto.request.UpdateTaskRequest;
import com.example.InternShip.dto.response.TaskResponse;
import com.example.InternShip.entity.Intern;
import com.example.InternShip.entity.Mentor;
import com.example.InternShip.entity.Sprint;
import com.example.InternShip.entity.Task;
import com.example.InternShip.entity.User;
import com.example.InternShip.entity.enums.Role;
import com.example.InternShip.entity.enums.TaskStatus;
import com.example.InternShip.repository.InternRepository;
import com.example.InternShip.repository.MentorRepository;
import com.example.InternShip.repository.SprintRepository;
import com.example.InternShip.repository.TaskRepository;
import com.example.InternShip.service.AuthService;
import com.example.InternShip.service.TaskService;
import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;

import org.springframework.data.jpa.domain.Specification;
import jakarta.persistence.criteria.Predicate;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import com.example.InternShip.exception.BadRequestException;
import com.example.InternShip.dto.request.BatchTaskUpdateRequest;
import com.example.InternShip.exception.ForbiddenException;
import com.example.InternShip.exception.ResourceNotFoundException;
import com.example.InternShip.exception.SprintExpiredException;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class TaskServiceImpl implements TaskService {

    private final TaskRepository taskRepository;
    private final SprintRepository sprintRepository;
    private final InternRepository internRepository;
    private final MentorRepository mentorRepository;
    private final AuthService authService;

    @Override
    @Transactional
    public void batchUpdateTasks(BatchTaskUpdateRequest request) {
        List<Task> tasksToUpdate = taskRepository.findAllById(request.getTaskIds());
        if (tasksToUpdate.size() != request.getTaskIds().size()) {
            throw new ResourceNotFoundException("One or more tasks not found.");
        }

        // Simple permission check: for now, only the mentor of the first task's team can perform this.
        // A more robust check might be needed depending on requirements.
        if (!tasksToUpdate.isEmpty()) {
            User user = authService.getUserLogin();
            Sprint firstTaskSprint = tasksToUpdate.get(0).getSprint();
            if (firstTaskSprint != null) { // Tasks might be in backlog (sprint is null)
                 checkTaskManagementPermission(user, firstTaskSprint, "manage");
            } else if (user.getRole() != Role.MENTOR) {
                throw new ForbiddenException("Only mentors can manage backlog tasks.");
            }
        }


        switch (request.getAction()) {
            case "MOVE_TO_SPRINT":
                if (request.getTargetSprintId() == null) {
                    throw new BadRequestException("Target sprint ID is required for MOVE_TO_SPRINT action.");
                }
                Sprint targetSprint = sprintRepository.findById(request.getTargetSprintId())
                        .orElseThrow(() -> new ResourceNotFoundException("Sprint", "id", request.getTargetSprintId()));
                tasksToUpdate.forEach(task -> task.setSprint(targetSprint));
                break;
            case "MOVE_TO_BACKLOG":
                tasksToUpdate.forEach(task -> task.setSprint(null));
                break;
            case "CANCEL":
                tasksToUpdate.forEach(task -> task.setStatus(TaskStatus.CANCELLED));
                break;
            default:
                throw new IllegalArgumentException("Invalid action: " + request.getAction());
        }

        taskRepository.saveAll(tasksToUpdate);
    }

    @Override
    public TaskResponse createTask(CreateTaskRequest request) {
        User creator = authService.getUserLogin();

        Sprint sprint = sprintRepository.findById(request.getSprintId())
                .orElseThrow(() -> new ResourceNotFoundException("Sprint", "id", request.getSprintId()));
        // kiểm tra spirnt đã hết hạn chưa
        if (!sprint.getEndDate().isAfter(LocalDate.now())) {
            throw new SprintExpiredException(
                    String.format("Sprint '%s' (ID: %d) has already ended on %s.",
                            sprint.getName(), sprint.getId(), sprint.getEndDate()));
        }
        checkTaskManagementPermission(creator, sprint, "create");

        validateTaskDeadline(request.getDeadline(), sprint);

        Intern assignedIntern = null; // Assignee is optional
        if (request.getAssigneeId() != null) {
            assignedIntern = internRepository.findById(request.getAssigneeId())
                    .orElseThrow(() -> new ResourceNotFoundException("Intern to be assigned", "id",
                            request.getAssigneeId()));

            // Validate that the assigned intern is part of the sprint's team
            if (assignedIntern.getTeam() == null
                    || !assignedIntern.getTeam().getId().equals(sprint.getTeam().getId())) {
                throw new BadRequestException("The assigned intern is not a member of the sprint's team.");
            }
        }

        Mentor teamMentor = sprint.getTeam().getMentor();
        if (teamMentor == null) {
            throw new IllegalStateException("The team for this sprint does not have an assigned mentor.");
        }

        Task task = new Task();
        task.setName(request.getName());
        task.setDescription(request.getDescription());
        task.setSprint(sprint);
        task.setTeam(sprint.getTeam()); // Permanently stamp the team
        task.setAssignee(assignedIntern); // Can be null
        task.setMentor(teamMentor);
        task.setCreatedBy(creator);
        task.setDeadline(request.getDeadline() == null ? sprint.getEndDate() : request.getDeadline());
        task.setStatus(TaskStatus.TODO);
        Task savedTask = taskRepository.save(task);
        TaskResponse taskResponse = mapToTaskResponse(savedTask);
        return taskResponse;
    }

    public TaskResponse mapToTaskResponse(Task task) {
        TaskResponse response = new TaskResponse();
        response.setId(task.getId());
        response.setName(task.getName());
        response.setDescription(task.getDescription());
        response.setStatus(task.getStatus());
        response.setDeadline(task.getDeadline());
        response.setSprint_Id(task.getSprint()==null?null:task.getSprint().getId());

        if (task.getAssignee() != null) {
            response.setAssignee_Id(task.getAssignee().getId());
            if (task.getAssignee().getUser() != null) {
                response.setAssigneeName(task.getAssignee().getUser().getFullName());
            }
        }

        if (task.getMentor() != null) {
            response.setMentorId(task.getMentor().getId());
            if (task.getMentor().getUser() != null) {
                response.setMentorName(task.getMentor().getUser().getFullName());
            }
        }

        if (task.getCreatedBy() != null) {
            response.setCreatedById(task.getCreatedBy().getId());
            response.setCreatedByName(task.getCreatedBy().getFullName());
        }

        return response;
    }

    // hàm kiểm tra người dùng hiện tại có quyền không
    private void checkTaskManagementPermission(User user, Sprint sprint, String action) {
        if (!user.getRole().equals(Role.INTERN) && !user.getRole().equals(Role.MENTOR)) {
            throw new ForbiddenException(
                    "You do not have permission to " + action + " tasks. Required role: INTERN or MENTOR.");
        }

        if (user.getRole().equals(Role.INTERN)) {
            Intern intern = internRepository.findByUser(user)
                    .orElseThrow(() -> new ResourceNotFoundException("Intern profile not found for the current user."));

            if (!sprint.getTeam().getId().equals(intern.getTeam().getId())) {
                throw new ForbiddenException("You can only " + action + " tasks for the team you are a member of.");
            }
        }

        if (user.getRole().equals(Role.MENTOR)) {
            Mentor mentor = mentorRepository.findByUser(user)
                    .orElseThrow(() -> new ResourceNotFoundException("Mentor profile not found for the current user."));

            if (mentor.getTeams().stream().noneMatch(team -> team.getId().equals(sprint.getTeam().getId()))) {
                throw new ForbiddenException("You can only " + action + " tasks for a team that you are mentoring.");
            }
        }
    }

    @Override
    public TaskResponse updateTask(Long taskId, UpdateTaskRequest request) {
        User user = authService.getUserLogin();

        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task", "id", taskId));

        Sprint sprint = task.getSprint();

        // Check if the sprint has expired
        if (!sprint.getEndDate().isAfter(LocalDate.now())) {
            throw new SprintExpiredException(
                    String.format("Cannot update task. Sprint '%s' (ID: %d) has already ended on %s.",
                            sprint.getName(), sprint.getId(), sprint.getEndDate()));
        }

        checkTaskManagementPermission(user, sprint, "update");

        // Validate deadline only if it's provided in the request
        if (request.getDeadline() != null) {
            validateTaskDeadline(request.getDeadline(), sprint);
        }

        // Apply partial updates: only update fields that are not null in the request
        if (request.getName() != null) {
            task.setName(request.getName());
        }
        if (request.getDescription() != null) {
            task.setDescription(request.getDescription());
        }
        if (request.getStatus() != null) {
            task.setStatus(request.getStatus());
        }
        if (request.getDeadline() != null) {
            validateTaskDeadline(request.getDeadline(), sprint);
            task.setDeadline(request.getDeadline());
        }

        // Handle assignee update
        if (request.getAssigneeId() != null) {
            Intern assignedIntern = internRepository.findById(request.getAssigneeId())
                    .orElseThrow(() -> new ResourceNotFoundException("Intern to be assigned", "id", request.getAssigneeId()));
            // Validate that the assigned intern is part of the sprint's team
            if (assignedIntern.getTeam() == null || !assignedIntern.getTeam().getId().equals(sprint.getTeam().getId())) {
                throw new BadRequestException("The assigned intern is not a member of the sprint's team.");
            }
            task.setAssignee(assignedIntern);
        } else {
            // If the assigneeId is explicitly passed as null, un-assign the task
            task.setAssignee(null);
        }

        Task updatedTask = taskRepository.save(task);
        TaskResponse taskResponse = mapToTaskResponse(updatedTask);
        return taskResponse;
    }

    // hàm kiểm tra deadline của task có hợp lệ không
    private void validateTaskDeadline(java.time.LocalDate deadline, Sprint sprint) {
        if (deadline != null) {
            if (deadline.isBefore(sprint.getStartDate()) || deadline.isAfter(sprint.getEndDate())) {
                throw new BadRequestException(
                        "Task deadline must be within the sprint's date range: " +
                                sprint.getStartDate() + " to " + sprint.getEndDate() + ".");
            }
        }
    }

    @Override
    public void deleteTask(Long taskId) {
        User user = authService.getUserLogin();

        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task", "id", taskId));

        Sprint sprint = task.getSprint();

        if (!sprint.getEndDate().isAfter(LocalDate.now())) {
            throw new SprintExpiredException(
                    String.format("Sprint '%s' (ID: %d) has already ended on %s.",
                            sprint.getName(), sprint.getId(), sprint.getEndDate()));
        }

        checkTaskManagementPermission(user, sprint, "delete");

        taskRepository.delete(task);
    }

    @Override
    public List<TaskResponse> getTasksBySprint(Long sprintId, TaskStatus status, Integer assigneeId) {
        User user = authService.getUserLogin();
        Sprint sprint = sprintRepository.findById(sprintId)
                .orElseThrow(() -> new ResourceNotFoundException("Sprint", "id", sprintId));

        checkTaskManagementPermission(user, sprint, "view");

        Specification<Task> spec = (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();
            predicates.add(criteriaBuilder.equal(root.get("sprint").get("id"), sprintId));

            if (status != null) {
                predicates.add(criteriaBuilder.equal(root.get("status"), status));
            }
            if (assigneeId != null) {
                predicates.add(criteriaBuilder.equal(root.get("assignee").get("id"), assigneeId));
            }
            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };

        List<Task> tasks = taskRepository.findAll(spec);
        return tasks.stream()
                .map(task -> mapToTaskResponse(task))
                .collect(Collectors.toList());
    }

    @Override
    public List<TaskResponse> getTasksByAssignee(Integer assigneeId) {
        List<Task> tasks = taskRepository.findByAssigneeId(assigneeId);
        return tasks.stream()
                .map(task -> mapToTaskResponse(task))
                .collect(Collectors.toList());
    }

    @Override
    public TaskResponse getTaskById(Long taskId) {
        User user = authService.getUserLogin();

        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task", "id", taskId));

        Sprint sprint = task.getSprint();

        checkTaskManagementPermission(user, sprint, "view");

        return mapToTaskResponse(task);
    }

    @Override
    public List<TaskResponse> getTasksByTeam(String teamId) {
        // Optional: Add permission check to ensure user is part of the team
        List<Task> tasks = taskRepository.findByTeamId(teamId);
        return tasks.stream()
                .map(this::mapToTaskResponse)
                .collect(Collectors.toList());
    }
}

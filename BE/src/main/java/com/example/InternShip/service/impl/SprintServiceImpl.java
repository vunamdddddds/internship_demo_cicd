package com.example.InternShip.service.impl;

import com.example.InternShip.dto.request.CreateSprintRequest;
import com.example.InternShip.dto.request.UpdateSprintRequest;
import com.example.InternShip.dto.response.SprintResponse;
import com.example.InternShip.entity.Team;
import com.example.InternShip.entity.Sprint;
import com.example.InternShip.exception.SprintConflictException;
import com.example.InternShip.exception.SprintUpdateException;
import com.example.InternShip.exception.InvalidSprintDateException;
import com.example.InternShip.exception.ResourceNotFoundException;
import com.example.InternShip.repository.TeamRepository;
import com.example.InternShip.repository.SprintRepository;
import com.example.InternShip.service.SprintService;
import com.example.InternShip.service.EmailService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;

import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

import com.example.InternShip.entity.User;
import com.example.InternShip.entity.enums.Role;
import com.example.InternShip.service.AuthService;

import com.example.InternShip.repository.InternRepository;
import com.example.InternShip.entity.Intern;

@Service
@RequiredArgsConstructor
public class SprintServiceImpl implements SprintService {

    private final SprintRepository sprintRepository;
    private final TeamRepository teamRepository;
    private final AuthService authService;
    private final InternRepository internRepository;
    private final EmailService emailService;

    @Override
    public SprintResponse createSprint(Integer teamId, CreateSprintRequest request) {
        User user = authService.getUserLogin();
        Team team = teamRepository.findById(teamId)
                .orElseThrow(
                        () -> new com.example.InternShip.exception.ResourceNotFoundException("Team", "id", teamId));

        checkSprintManagementPermission(user, team, "create");

        // Validate new sprint dates
        LocalDate today = LocalDate.now();
        if (request.getStartDate().isBefore(today)) {
            throw new InvalidSprintDateException("Sprint start date cannot be in the past.");
        }
        if (request.getEndDate().isBefore(today)) {
            throw new InvalidSprintDateException("Sprint end date cannot be in the past.");
        }
        if (request.getStartDate().isAfter(request.getEndDate())) {
            throw new InvalidSprintDateException("Sprint start date cannot be after end date.");
        }

        // Check for overlapping sprints
        List<Sprint> existingSprints = team.getSprints();
        for (Sprint existingSprint : existingSprints) {
            // Check for overlap: (StartA <= EndB) and (EndA >= StartB)
            if (request.getStartDate().isBefore(existingSprint.getEndDate()) &&
                    request.getEndDate().isAfter(existingSprint.getStartDate())) {
                throw new SprintConflictException("Sprint dates overlap with an existing sprint.");
            }
        }

        Sprint sprint = new Sprint();
        sprint.setName(request.getName());
        sprint.setGoal(request.getGoal());
        sprint.setStartDate(request.getStartDate());
        sprint.setEndDate(request.getEndDate());
        sprint.setTeam(team);

        Sprint savedSprint = sprintRepository.save(sprint);

        // Send notification email
        emailService.sendNewSprintNotificationEmail(savedSprint);

        SprintResponse sprintResponse = mapToSprintResponse(savedSprint);
        return sprintResponse;
    }

    public SprintResponse mapToSprintResponse(Sprint sprint) {

        SprintResponse response = new SprintResponse();
        response.setId(sprint.getId());
        response.setName(sprint.getName());
        response.setGoal(sprint.getGoal());
        response.setStartDate(sprint.getStartDate());
        response.setEndDate(sprint.getEndDate());
        response.setTeamId(sprint.getTeam().getId());
        return response;
    }

    private void checkSprintManagementPermission(User user, Team team, String action) {
        // HR can view any sprint
        if (action.equals("view") && user.getRole().equals(Role.HR)) {
            return;
        }

        // Interns can view sprints of their own team
        if (action.equals("view") && user.getRole().equals(Role.INTERN)) {
            Intern intern = internRepository.findByUser(user)
                    .orElseThrow(() -> new ResourceNotFoundException("Intern profile not found for the current user."));
            if (intern.getTeam() != null && intern.getTeam().getId().equals(team.getId())) {
                return; // Allowed
            }
        }

        // Mentor can manage sprints of their own team
        if (user.getRole().equals(Role.MENTOR)) {
            if (team.getMentor() != null && team.getMentor().getUser().getId().equals(user.getId())) {
                return; // Allowed
            }
        }
        
        // If no permission rule matched, deny access.
        throw new com.example.InternShip.exception.ForbiddenException(
                "You do not have permission to " + action + " sprints for this team.");
    }

    @Override
    public SprintResponse updateSprint(Long sprintId, UpdateSprintRequest request) {
        User user = authService.getUserLogin();
        Sprint sprint = sprintRepository.findById(sprintId)
                .orElseThrow(() -> new ResourceNotFoundException("Sprint", "id", sprintId));

        Team team = sprint.getTeam();
        checkSprintManagementPermission(user, team, "update");

        // Apply partial updates for non-date fields first
        if (request.getName() != null) {
            sprint.setName(request.getName());
        }
        if (request.getGoal() != null) {
            sprint.setGoal(request.getGoal());
        }

        // Handle date updates based on sprint status
        LocalDate today = LocalDate.now();
        boolean isSprintStarted = !today.isBefore(sprint.getStartDate());
        boolean isSprintEnded = today.isAfter(sprint.getEndDate());

        if (isSprintEnded) {
            throw new SprintUpdateException("Cannot update a sprint that has already ended.");
        }

        if (isSprintStarted) { // Sprint is in progress
            if (request.getStartDate() != null && !request.getStartDate().equals(sprint.getStartDate())) {
                throw new SprintUpdateException(
                        "Cannot change the start date of a sprint that is already in progress.");
            }
            if (request.getEndDate() != null) {
                if (request.getEndDate().isBefore(sprint.getEndDate())) {
                    throw new SprintUpdateException(
                            "Cannot shorten a sprint that is already in progress. You can only extend the end date.");
                }
                sprint.setEndDate(request.getEndDate());
            }
        } else { // Sprint has not started yet
            LocalDate newStartDate = request.getStartDate() != null ? request.getStartDate() : sprint.getStartDate();
            LocalDate newEndDate = request.getEndDate() != null ? request.getEndDate() : sprint.getEndDate();

            if (request.getStartDate() != null || request.getEndDate() != null) {
                if (newStartDate.isBefore(today)) {
                    throw new InvalidSprintDateException("Sprint start date cannot be in the past.");
                }
                if (newEndDate.isBefore(today)) {
                    throw new InvalidSprintDateException("Sprint end date cannot be in the past.");
                }
                if (newStartDate.isAfter(newEndDate)) {
                    throw new InvalidSprintDateException("Sprint start date cannot be after end date.");
                }

                // Check for overlapping sprints
                List<Sprint> otherSprints = team.getSprints().stream()
                        .filter(s -> !s.getId().equals(sprintId))
                        .collect(Collectors.toList());
                for (Sprint existingSprint : otherSprints) {
                    if (newStartDate.isBefore(existingSprint.getEndDate())
                            && newEndDate.isAfter(existingSprint.getStartDate())) {
                        throw new SprintConflictException("Sprint dates overlap with an existing sprint.");
                    }
                }
                sprint.setStartDate(newStartDate);
                sprint.setEndDate(newEndDate);
            }
        }

        Sprint updatedSprint = sprintRepository.save(sprint);
        SprintResponse sprintResponse = mapToSprintResponse(updatedSprint);
        return sprintResponse;
    }


    @Override
    public void deleteSprint(Long sprintId) {
        User user = authService.getUserLogin();
        Sprint sprint = sprintRepository.findById(sprintId)
                .orElseThrow(() -> new ResourceNotFoundException("Sprint", "id", sprintId));
        Team team = sprint.getTeam();

        checkSprintManagementPermission(user, team, "delete");

        if (!sprint.getStartDate().isAfter(LocalDate.now())) {
            throw new SprintUpdateException("Cannot delete a sprint that has already started or ended.");
        }

        sprintRepository.deleteById(sprintId);
    }

    @Override
    public List<SprintResponse> getSprintsByTeam(Integer teamId) {
        User user = authService.getUserLogin();
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new ResourceNotFoundException("Team", "id", teamId));

        checkSprintManagementPermission(user, team, "view");

        List<Sprint> sprints = sprintRepository.findByTeamIdOrderByStartDateDesc(teamId);

        return sprints.stream()
                .map(sprint -> mapToSprintResponse(sprint))
                .collect(Collectors.toList());
    }

    @Override
    public SprintResponse getSprintById(Long sprintId) {
        User user = authService.getUserLogin();
        Sprint sprint = sprintRepository.findById(sprintId)
                .orElseThrow(() -> new ResourceNotFoundException("Sprint", "id", sprintId));
        Team team = sprint.getTeam();

        checkSprintManagementPermission(user, team, "view");

        SprintResponse sprintResponse = mapToSprintResponse(sprint);
        return sprintResponse;
    }
}

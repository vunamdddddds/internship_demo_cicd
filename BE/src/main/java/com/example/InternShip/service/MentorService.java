package com.example.InternShip.service;

import com.example.InternShip.dto.request.CreateMentorRequest;
import com.example.InternShip.dto.request.UpdateMentorRequest;
import com.example.InternShip.dto.response.GetAllMentorResponse;
import com.example.InternShip.dto.response.GetMentorResponse;

import java.util.List;

import com.example.InternShip.dto.response.SprintResponse;

import com.example.InternShip.dto.response.TeamResponse;

public interface MentorService {
    GetMentorResponse createMentor(CreateMentorRequest request);
    GetMentorResponse updateMentorDepartment(Integer mentorId, UpdateMentorRequest request);
    Object getAll(List<Integer> department, String keyword, int page);
    GetMentorResponse getMentorById(int id);
    public List<GetAllMentorResponse> getAllMentor();
    List<SprintResponse> getSprintsForCurrentUser();
    List<TeamResponse> getTeamsForCurrentUser();
}
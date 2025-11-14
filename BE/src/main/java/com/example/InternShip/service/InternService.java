package com.example.InternShip.service;
  
import java.util.List;

import com.example.InternShip.dto.request.CreateInternRequest;
import com.example.InternShip.dto.request.UpdateInternRequest;
import com.example.InternShip.dto.request.GetAllInternRequest;
import com.example.InternShip.dto.response.GetAllInternNoTeamResponse;
import com.example.InternShip.dto.response.GetInternResponse;
import com.example.InternShip.dto.response.MyProfileResponse;
import com.example.InternShip.dto.response.PagedResponse;

public interface InternService {
    GetInternResponse getInternById(int id);
    GetInternResponse updateIntern(Integer id, UpdateInternRequest updateInternRequest);
    GetInternResponse createIntern(CreateInternRequest request);
    PagedResponse<GetInternResponse> getAllIntern(GetAllInternRequest request);
    List<GetAllInternNoTeamResponse> getAllInternNoTeam(Integer teamId);
    Integer getAuthenticatedInternTeamId();
    MyProfileResponse getMyProfile();
}


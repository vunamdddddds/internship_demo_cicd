package com.example.InternShip.service;

import java.util.List;

import com.example.InternShip.dto.response.GetInternProgramResponse;
import com.example.InternShip.dto.response.GetAllInternProgramResponse;
import com.example.InternShip.dto.response.PagedResponse;
import com.example.InternShip.dto.request.CreateInternProgramRequest;
import com.example.InternShip.dto.request.UpdateInternProgramRequest;
import org.quartz.SchedulerException;


public interface InternshipProgramService {
    public List<GetAllInternProgramResponse> getAllPrograms();
    PagedResponse<GetInternProgramResponse> getAllInternshipPrograms(List<Integer> department, String keyword, int page);
    public void endPublish (int programId);
    public void endReviewing (int programId);
    public void startInternship(int programId);
    public GetInternProgramResponse createInternProgram (CreateInternProgramRequest request) throws SchedulerException;
    public GetInternProgramResponse updateInternProgram(UpdateInternProgramRequest request, int id) throws SchedulerException;
    public GetInternProgramResponse cancelInternProgram(int id) throws SchedulerException;
    public GetInternProgramResponse publishInternProgram(int id) throws SchedulerException;

}

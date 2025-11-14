package com.example.InternShip.service;

import com.example.InternShip.dto.request.CreateLeaveApplicationRequest;
import com.example.InternShip.dto.request.RejectLeaveApplicationRequest;
import com.example.InternShip.dto.response.GetAllLeaveApplicationResponse;
import com.example.InternShip.dto.response.GetLeaveApplicationResponse;
import com.example.InternShip.dto.response.InternGetAllLeaveApplicationResponse;
import com.example.InternShip.dto.response.PagedResponse;

public interface LeaveRequestService {

    void createLeaveRequest(CreateLeaveApplicationRequest request);

    PagedResponse<GetAllLeaveApplicationResponse> getAllLeaveApplication(Boolean approved, String keyword, String type,
            int page, int size);

    GetLeaveApplicationResponse viewLeaveApplication(Integer id);

    void cancelLeaveApplication(Integer id);

    void approveLeaveAppication(Integer id);

    void rejectLeaveAppication(RejectLeaveApplicationRequest request);

    InternGetAllLeaveApplicationResponse getAllLeaveApplicationByIntern();
}

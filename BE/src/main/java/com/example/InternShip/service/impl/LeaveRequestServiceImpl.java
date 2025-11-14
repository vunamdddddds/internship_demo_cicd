package com.example.InternShip.service.impl;

import com.example.InternShip.dto.request.CreateLeaveApplicationRequest;
import com.example.InternShip.dto.request.RejectLeaveApplicationRequest;
import com.example.InternShip.dto.response.FileResponse;
import com.example.InternShip.dto.response.GetAllLeaveApplicationResponse;
import com.example.InternShip.dto.response.GetLeaveApplicationResponse;
import com.example.InternShip.dto.response.InternGetAllLeaveApplicationResponse;
import com.example.InternShip.dto.response.InternGetAllLeaveApplicationResponseSupport;
import com.example.InternShip.dto.response.PagedResponse;
import com.example.InternShip.entity.Intern;
import com.example.InternShip.entity.LeaveRequest;
import com.example.InternShip.entity.User;
import com.example.InternShip.entity.enums.Role;
import com.example.InternShip.exception.ErrorCode;
import com.example.InternShip.repository.LeaveRequestRepository;
import com.example.InternShip.repository.UserRepository;
import com.example.InternShip.service.AuthService;
import com.example.InternShip.service.CloudinaryService;
import com.example.InternShip.service.LeaveRequestService;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

import java.time.LocalDate;
import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class LeaveRequestServiceImpl implements LeaveRequestService {
    private final LeaveRequestRepository leaveRequestRepository;

    private final UserRepository userRepository;

    private final AuthService authService;

    private final CloudinaryService cloudinaryService;

    private final ModelMapper modelMapper;

    @Override
    public void createLeaveRequest(CreateLeaveApplicationRequest request) {
        // Lấy ra thằng intern request
        User user = authService.getUserLogin();
        Intern intern = user.getIntern();

        // Kiểm tra type hợp lệ
        if (!request.getType().equals(LeaveRequest.Type.EARLY_LEAVE.toString()) &&
                !request.getType().equals(LeaveRequest.Type.LATE.toString()) &&
                !request.getType().equals(LeaveRequest.Type.ON_LEAVE.toString())) {
            throw new IllegalArgumentException(ErrorCode.TYPE_LEAVE_APPLICATION_INVALID.getMessage());
        }
        // Kiểm tra date
        if (request.getDate() == null || request.getDate().isBefore(LocalDate.now())) {
            throw new IllegalArgumentException("Ngày nghỉ không hợp lệ");
        }
        // Tạo LeaveRequest
        LeaveRequest leaveRequest = new LeaveRequest();
        leaveRequest.setType(LeaveRequest.Type.valueOf(request.getType()));
        leaveRequest.setDate(request.getDate());
        leaveRequest.setReason(request.getReason());
        if (request.getAttachedFile() != null && !request.getAttachedFile().isEmpty()) {
            FileResponse fileResponse = cloudinaryService.uploadFile(request.getAttachedFile(),
                    "Leave Application Attached File");
            leaveRequest.setAttachedFileUrl(fileResponse.getFileUrl());
        }
        leaveRequest.setIntern(intern);
        leaveRequestRepository.save(leaveRequest);
    }

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<GetAllLeaveApplicationResponse> getAllLeaveApplication(
            Boolean approved, String keyword, String type, int page, int size) {

        page = Math.max(0, page - 1);
        Pageable pageable = PageRequest.of(page, size, Sort.by("date").descending());

        LeaveRequest.Type leaveType = null;
        if (type != null && !type.isEmpty()) {
            try {
                leaveType = LeaveRequest.Type.valueOf(type.toUpperCase());
            } catch (IllegalArgumentException e) {
                throw new IllegalArgumentException(ErrorCode.TYPE_LEAVE_APPLICATION_INVALID.getMessage());
            }
        }

        Page<LeaveRequest> leaveApplications = leaveRequestRepository
                .searchLeaveApplication(approved, leaveType, keyword, pageable);

        // Map entity → DTO
        List<GetAllLeaveApplicationResponse> res = leaveApplications.getContent().stream()
                .map(lr -> {
                    GetAllLeaveApplicationResponse dto = new GetAllLeaveApplicationResponse();
                    dto.setId(lr.getId());
                    dto.setInternName(lr.getIntern().getUser().getFullName());
                    dto.setType(lr.getType());
                    dto.setDate(lr.getDate());
                    dto.setReason(lr.getReason());
                    dto.setAttachedFileUrl(lr.getAttachedFileUrl());
                    if (lr.getApproved() == null) {
                        dto.setApproved(null);
                    } else {
                        dto.setApproved(lr.getApproved());
                    }
                    dto.setReasonReject(lr.getReasonReject());
                    if (lr.getProcessedBy() != null) {
                        dto.setProcessedByName(lr.getProcessedBy().getFullName());
                    }
                    return dto;
                }).toList();

        return new PagedResponse<>(
                res,
                page + 1,
                leaveApplications.getTotalElements(),
                leaveApplications.getTotalPages(),
                leaveApplications.hasNext(),
                leaveApplications.hasPrevious());
    }

    @Override
    public InternGetAllLeaveApplicationResponse getAllLeaveApplicationByIntern() {
        User user = authService.getUserLogin();
        Intern intern = user.getIntern();

        InternGetAllLeaveApplicationResponse response = new InternGetAllLeaveApplicationResponse();

        response.setCountLeaveApplication(leaveRequestRepository.countAllByInternId(intern.getId()));
        response.setCountPendingApprove(leaveRequestRepository.countPendingByInternId(intern.getId()));
        response.setCountApprove(leaveRequestRepository.countApprovedByInternId(intern.getId()));
        response.setCountReject(leaveRequestRepository.countRejectedByInternId(intern.getId()));

        List<InternGetAllLeaveApplicationResponseSupport> leaveApps = leaveRequestRepository
                .findAllByInternId(intern.getId())
                .stream()
                .map(l -> {
                    InternGetAllLeaveApplicationResponseSupport dto = new InternGetAllLeaveApplicationResponseSupport();
                    dto.setId(l.getId());
                    dto.setType(l.getType());
                    dto.setDate(l.getDate());
                    dto.setReason(l.getReason());
                    dto.setApproved(l.getApproved() != null ? l.getApproved() : false);
                    return dto;
                })
                .toList();

        response.setLeaveApplications(leaveApps);
        return response;
    }

    @Override
    public GetLeaveApplicationResponse viewLeaveApplication(Integer id) {
        LeaveRequest leaveRequest = leaveRequestRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(ErrorCode.LEAVE_APPLICATION_NOT_EXISTS.getMessage()));
        GetLeaveApplicationResponse res = modelMapper.map(leaveRequest, GetLeaveApplicationResponse.class);
        res.setInternName(leaveRequest.getIntern().getUser().getFullName());
        return res;
    }

    @Override
    public void cancelLeaveApplication(Integer id) {
        // Tính làm cái check đơn của người dùng nhưng mà thôi
        LeaveRequest leaveRequest = leaveRequestRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(ErrorCode.LEAVE_APPLICATION_NOT_EXISTS.getMessage()));
        if (!leaveRequest.getApproved()) {
            leaveRequestRepository.delete(leaveRequest);
        }
    }

    @Override
    public void approveLeaveAppication(Integer id) {
        User user = authService.getUserLogin();
        if (user.getRole() != Role.HR) {
            throw new IllegalArgumentException("User does not have permission to approve");
        }
        LeaveRequest leaveRequest = leaveRequestRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(ErrorCode.LEAVE_APPLICATION_NOT_EXISTS.getMessage()));
        if (leaveRequest.getApproved() == null) {
            leaveRequest.setApproved(true);
            leaveRequest.setProcessedBy(user);
            leaveRequestRepository.save(leaveRequest);
        } else {
            throw new IllegalArgumentException(ErrorCode.ACTION_INVALID.getMessage());
        }
    }

    @Override
    public void rejectLeaveAppication(RejectLeaveApplicationRequest request){
        User user = authService.getUserLogin();
        if (user.getRole() != Role.HR) {
            throw new IllegalArgumentException("User does not have permission to reject");
        }
        LeaveRequest leaveRequest = leaveRequestRepository.findById(request.getId())
                .orElseThrow(() -> new EntityNotFoundException(ErrorCode.LEAVE_APPLICATION_NOT_EXISTS.getMessage()));
        if (leaveRequest.getApproved() == null) {
            leaveRequest.setApproved(false);
            leaveRequest.setReasonReject(request.getReasonReject());
            leaveRequest.setProcessedBy(user);
            leaveRequestRepository.save(leaveRequest);
        } else {
            throw new IllegalArgumentException(ErrorCode.ACTION_INVALID.getMessage());
        }
    }
}

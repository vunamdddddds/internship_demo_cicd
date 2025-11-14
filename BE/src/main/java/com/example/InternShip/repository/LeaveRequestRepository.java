package com.example.InternShip.repository;

import com.example.InternShip.entity.Intern;
import com.example.InternShip.entity.LeaveRequest;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface LeaveRequestRepository extends JpaRepository<LeaveRequest, Integer> {
        // Tìm đơn nghỉ phép (đã được duyệt) của 1 intern, trong 1 ngày cụ thể
        Optional<LeaveRequest> findByInternAndDateAndApproved(Intern intern, LocalDate date, Boolean approved);

        @Query("""
                        SELECT lr
                        FROM LeaveRequest lr
                        JOIN lr.intern i
                        WHERE ((:approved IS NULL AND lr.approved IS NULL) OR (lr.approved = :approved))
                          AND (:type IS NULL OR lr.type = :type)
                          AND (:keyword IS NULL OR :keyword = '' OR
                               LOWER(i.user.fullName) LIKE LOWER(CONCAT('%', :keyword, '%')))
                        """)
        Page<LeaveRequest> searchLeaveApplication(
                        @Param("approved") Boolean approved,
                        @Param("type") LeaveRequest.Type type,
                        @Param("keyword") String keyword,
                        Pageable pageable);

        // Lấy tất cả đơn nghỉ của 1 intern
        @Query("SELECT l FROM LeaveRequest l WHERE l.intern.id = :internId ORDER BY l.date DESC")
        List<LeaveRequest> findAllByInternId(Integer internId);

        // Đếm tổng số đơn
        @Query("SELECT COUNT(l) FROM LeaveRequest l WHERE l.intern.id = :internId")
        int countAllByInternId(Integer internId);

        // Đếm số đơn đang chờ duyệt (approved IS NULL)
        @Query("SELECT COUNT(l) FROM LeaveRequest l WHERE l.intern.id = :internId AND l.approved IS NULL")
        int countPendingByInternId(Integer internId);

        // Đếm số đơn được duyệt (approved = true)
        @Query("SELECT COUNT(l) FROM LeaveRequest l WHERE l.intern.id = :internId AND l.approved = true")
        int countApprovedByInternId(Integer internId);

        // Đếm số đơn bị từ chối (approved = false)
        @Query("SELECT COUNT(l) FROM LeaveRequest l WHERE l.intern.id = :internId AND l.approved = false")
        int countRejectedByInternId(Integer internId);
}

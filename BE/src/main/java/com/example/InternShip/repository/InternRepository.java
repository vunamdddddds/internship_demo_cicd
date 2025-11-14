package com.example.InternShip.repository;

import java.util.List;
import java.util.Optional;

import com.example.InternShip.entity.Intern;
import com.example.InternShip.entity.Intern.Status;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import com.example.InternShip.entity.User;

public interface InternRepository extends JpaRepository<Intern, Integer> {
    Optional<Intern> findAllById(Integer id);

    boolean existsByUser(User user);

    @Query("""
                SELECT i
                FROM Intern i
                JOIN i.user u
                JOIN i.major m
                JOIN i.university uni
                WHERE (:majorId IS NULL OR m.id = :majorId)
                  AND (:universityId IS NULL OR uni.id = :universityId)
                  AND (
                        :keyword IS NULL
                        OR LOWER(u.fullName) LIKE LOWER(CONCAT('%', :keyword, '%'))
                        OR LOWER(u.email) LIKE LOWER(CONCAT('%', :keyword, '%'))
                        OR u.phone LIKE CONCAT('%', :keyword, '%')
                      )
            """)
    Page<Intern> searchInterns(
            @Param("majorId") Integer majorId,
            @Param("universityId") Integer universityId,
            @Param("keyword") String keyword,
            Pageable pageable);

    Optional<Intern> findByUser_IdAndStatusAndTeamIsNull(Integer id, Status active);

    int countByTeam_id(Integer id);

    Optional<Intern> findByUser(User user);

    List<Intern> findAllByStatus(Intern.Status status);

    List<Intern> findAllByStatusAndTeamNotNull(Intern.Status status);
}

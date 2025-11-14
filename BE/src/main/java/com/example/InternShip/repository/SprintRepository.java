package com.example.InternShip.repository;

import com.example.InternShip.entity.Sprint;
import com.example.InternShip.entity.Task;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface SprintRepository extends JpaRepository<Sprint, Long> {
   List<Sprint> findByTeamIdOrderByStartDateDesc(Integer teamId);
    Optional<Sprint> findById(Long id);
    List<Task> getTasksById(Long sprintId);
    List<Sprint> findByEndDate(LocalDate date);
}

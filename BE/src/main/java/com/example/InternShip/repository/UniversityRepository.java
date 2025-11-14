package com.example.InternShip.repository;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import com.example.InternShip.entity.University;

public interface UniversityRepository extends JpaRepository<University,Integer> {
   Optional< University> findAllById(Integer universityId);
}

package com.assignportal.assessment.repository;

import model.assessment.Assessment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AssessmentRepository extends JpaRepository<Assessment,Integer> {
    List<Assessment> findByModelId(int id);
}

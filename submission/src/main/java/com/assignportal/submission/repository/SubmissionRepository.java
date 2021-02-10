package com.assignportal.submission.repository;

import model.submission.Submission;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SubmissionRepository extends JpaRepository<Submission,Integer> {
    List<Submission> findByAssessmentId(int id);
    Optional<Submission> findByAssessmentIdAndStudentName(int id, String name);
}

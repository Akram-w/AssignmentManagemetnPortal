package com.assignportal.courses.repository;

import model.courses.Course;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CourseRepository extends JpaRepository<Course, Integer> {
    List<Course> findByTutorNameAndIsActiveTrue(String tutorName);
    List<Course> findByIdIn(List<Integer> idList);
    Optional<Course> findByTutorNameAndCourseName(String tutorName, String courseName);
}

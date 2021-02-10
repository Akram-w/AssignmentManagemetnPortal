package com.assignportal.courses.repository;

import model.courses.Course;
import org.springframework.data.jpa.repository.JpaRepository;

import javax.inject.Named;
import java.util.List;

public interface CourseRepository extends JpaRepository<Course, Integer> {
    List<Course> findByTutorNameAndIsActiveTrue(String tutorName);
    List<Course> findByIdIn(List<Integer> idList);
}

package com.assignportal.attendance.repository;

import model.attendance.Attendance;
import model.attendance.AttendanceId;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AttendanceRepository extends JpaRepository<Attendance, AttendanceId> {
    List<Attendance> findByAttendanceIdStudentName(String studentName);
    List<Attendance> findByAttendanceIdCourseId(int courseId);
}

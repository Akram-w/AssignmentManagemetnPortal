package com.assignportal.attendance.repository;

import model.attendance.Attendance;
import model.attendance.AttendanceId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface AttendanceRepository extends JpaRepository<Attendance, AttendanceId> {
    List<Attendance> findByAttendanceIdStudentName(String studentName);
    List<Attendance> findByAttendanceIdCourseId(int courseId);
    List<Attendance> findDistinctAttendanceIdAttendingDateByAttendanceIdCourseId(int courseId);
    List<Attendance> findByAttendanceIdAttendingDateAndAttendanceIdCourseId
            (String attendingDate,int courseId);
}

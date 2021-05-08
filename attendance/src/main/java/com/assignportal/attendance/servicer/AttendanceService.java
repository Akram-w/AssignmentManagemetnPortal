package com.assignportal.attendance.servicer;

import model.attendance.Attendance;
import model.attendance.AttendanceId;
import model.responseModels.AttendanceWithCourse;
import model.responseModels.CourseWithAttendanceList;

import java.util.List;
import java.util.concurrent.ExecutionException;

public interface AttendanceService {
    Attendance save(Attendance attendance,String type) throws ExecutionException, InterruptedException;

    Attendance update(Attendance attendance, AttendanceId attendanceId) throws ExecutionException, InterruptedException;

    void delete(AttendanceId attendanceId);

    List<Attendance> getAllAttendances();

    AttendanceWithCourse getAttendanceById(AttendanceId attendanceId) throws ExecutionException, InterruptedException;

    List<AttendanceWithCourse> getAttendanceByStudentName(String studentName) throws ExecutionException, InterruptedException;

    CourseWithAttendanceList getAttendanceByCourseId(int courseId) throws ExecutionException, InterruptedException;

    List<Attendance> saveList(List<Attendance> attendance);

    List<String> getDistinctDates(int courseId);

    List <Attendance> getAttendanceByDateAndCourse(String date,int courseId);
}

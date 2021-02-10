package model.responseModels;

import lombok.Data;
import model.attendance.Attendance;

@Data
public class AttendanceWithCourse {
    private Attendance attendance;
    private CoursesWithModule coursesWithModule;

    public AttendanceWithCourse() {
    }

    public AttendanceWithCourse(Attendance attendance, CoursesWithModule coursesWithModule) {
        this.attendance = attendance;
        this.coursesWithModule = coursesWithModule;
    }
}

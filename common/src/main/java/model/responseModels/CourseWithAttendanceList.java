package model.responseModels;

import lombok.Data;
import model.attendance.Attendance;

import java.util.List;

@Data
public class CourseWithAttendanceList {
    private CoursesWithModule coursesWithModule;
    private List<Attendance> attendanceList;

    public CourseWithAttendanceList() {
    }

    public CourseWithAttendanceList(CoursesWithModule coursesWithModule, List<Attendance> attendanceList) {
        this.coursesWithModule = coursesWithModule;
        this.attendanceList = attendanceList;
    }
}

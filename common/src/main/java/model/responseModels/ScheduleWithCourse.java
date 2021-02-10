package model.responseModels;

import lombok.Data;
import model.courses.Course;
import model.schedule.Schedule;

@Data
public class ScheduleWithCourse {
    Schedule schedule;
    Course course;

    public ScheduleWithCourse() {
    }

    public ScheduleWithCourse(Schedule schedule, Course course) {
        this.schedule = schedule;
        this.course = course;
    }
}

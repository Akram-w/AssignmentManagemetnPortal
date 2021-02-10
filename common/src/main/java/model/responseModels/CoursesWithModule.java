package model.responseModels;

import lombok.Data;
import model.courses.Course;
import model.modules.Module;

import java.util.List;

@Data
public class CoursesWithModule {

    private Course course;
    private List<Module> moduleList;

    public CoursesWithModule() {
    }

    public CoursesWithModule(Course course, List<Module> moduleList) {
        this.course = course;
        this.moduleList = moduleList;
    }
}

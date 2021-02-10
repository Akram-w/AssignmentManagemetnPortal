package model.exception;

import java.sql.SQLException;

public class CourseNotActive extends RuntimeException {
    public CourseNotActive(String msg){
        super(msg);
    }
}

package model.exception;

import java.sql.SQLException;

public class CourseNotExists extends RuntimeException {

    public CourseNotExists(String msg){
        super(msg);
    }
}

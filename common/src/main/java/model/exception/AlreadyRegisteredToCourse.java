package model.exception;

import java.sql.SQLException;

public class AlreadyRegisteredToCourse extends RuntimeException {
    public AlreadyRegisteredToCourse(String msg){
        super(msg);
    }
}

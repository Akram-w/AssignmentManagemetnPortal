package model.exception;

public class CourseAlreadyExists extends RuntimeException{
    public CourseAlreadyExists(String msg){
        super(msg);
    }
}

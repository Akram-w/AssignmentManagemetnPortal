package model.exception;

public class CourseAlreadyScheduled extends RuntimeException{
    public CourseAlreadyScheduled(String msg){
        super(msg);
    }
}

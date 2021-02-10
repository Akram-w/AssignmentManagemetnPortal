package model.exception;

public class AlreadyAttendanceMarked extends RuntimeException{
    public AlreadyAttendanceMarked(String msg){
        super(msg);
    }
}

package model.exception;

public class RoleMismatch extends RuntimeException{
    public RoleMismatch(String msg){
        super(msg);
    }
}

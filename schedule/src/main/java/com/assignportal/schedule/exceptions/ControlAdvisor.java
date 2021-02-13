package com.assignportal.schedule.exceptions;
import com.fasterxml.jackson.core.JsonProcessingException;
import model.exception.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import java.time.LocalDateTime;
import java.time.format.DateTimeParseException;
import java.util.LinkedHashMap;
import java.util.Map;

@ControllerAdvice
public class ControlAdvisor extends ResponseEntityExceptionHandler {

    @ExceptionHandler(CourseNotActive.class)
    public ResponseEntity<Object> handleCourseNotActive(
            CourseNotActive courseNotActive, WebRequest request){
        Map<String,Object> body=new LinkedHashMap<>();
        body.put("timestamp", LocalDateTime.now());
        body.put("message", courseNotActive.getMessage());

        return new ResponseEntity<>(body, HttpStatus.NOT_ACCEPTABLE);
    }

    @ExceptionHandler(CourseNotExists.class)
    public ResponseEntity<Object> handleCourseNotExists(
            CourseNotExists courseNotExists, WebRequest request){
        Map<String,Object> body=new LinkedHashMap<>();
        body.put("timestamp", LocalDateTime.now());
        body.put("message", courseNotExists.getMessage());

        return new ResponseEntity<>(body, HttpStatus.NOT_FOUND);
    }
    @ExceptionHandler(AlreadyRegisteredToCourse.class)
    public ResponseEntity<Object> handleAlreadyRegisteredToCourse(
            AlreadyRegisteredToCourse alreadyRegisteredToCourse,WebRequest webRequest){
        Map<String,Object> body=new LinkedHashMap<>();
        body.put("timestamp", LocalDateTime.now());
        body.put("message", alreadyRegisteredToCourse.getMessage());

        return new ResponseEntity<>(body, HttpStatus.NOT_ACCEPTABLE);
    }
    @ExceptionHandler(CourseAlreadyScheduled.class)
    public ResponseEntity<Object> handleAlreadyRegisteredToCourse(
            CourseAlreadyScheduled courseAlreadyScheduled,WebRequest webRequest){
        Map<String,Object> body=new LinkedHashMap<>();
        body.put("timestamp", LocalDateTime.now());
        body.put("message", courseAlreadyScheduled.getMessage());

        return new ResponseEntity<>(body, HttpStatus.NOT_ACCEPTABLE);
    }
    @ExceptionHandler(RoleMismatch.class)
    public ResponseEntity<Object> handleAlreadyRegisteredToCourse(
            RoleMismatch roleMismatch,WebRequest webRequest){
        Map<String,Object> body=new LinkedHashMap<>();
        body.put("timestamp", LocalDateTime.now());
        body.put("message", roleMismatch.getMessage());

        return new ResponseEntity<>(body, HttpStatus.NOT_ACCEPTABLE);
    }
    @ExceptionHandler(DateTimeParseException.class)
    public ResponseEntity<Object> handleAlreadyRegisteredToCourse(
            DateTimeParseException roleMismatch,WebRequest webRequest){
        Map<String,Object> body=new LinkedHashMap<>();
        body.put("timestamp", LocalDateTime.now());
        body.put("message", "Given date doesn't match");

        return new ResponseEntity<>(body, HttpStatus.NOT_ACCEPTABLE);
    }
    @ExceptionHandler(JsonProcessingException.class)
    public ResponseEntity<Object> handleAlreadyRegisteredToCourse(
            JsonProcessingException roleMismatch,WebRequest webRequest){
        Map<String,Object> body=new LinkedHashMap<>();
        body.put("timestamp", LocalDateTime.now());
        body.put("message", "Given Data doesn't match");

        return new ResponseEntity<>(body, HttpStatus.NOT_ACCEPTABLE);
    }
}

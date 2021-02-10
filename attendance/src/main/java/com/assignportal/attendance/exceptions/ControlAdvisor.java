package com.assignportal.attendance.exceptions;

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

    @ExceptionHandler(AlreadyAttendanceMarked.class)
    public ResponseEntity<Object> handleAlreadyAttendanceMarked(
            AlreadyAttendanceMarked roleMismatch,WebRequest webRequest){
        Map<String,Object> body=new LinkedHashMap<>();
        body.put("timestamp", LocalDateTime.now());
        body.put("message", roleMismatch.getMessage());

        return new ResponseEntity<>(body, HttpStatus.NOT_ACCEPTABLE);
    }

    @ExceptionHandler(DateTimeParseException.class)
    public ResponseEntity<Object> handleAlreadyAttendanceMarked(
            DateTimeParseException roleMismatch,WebRequest webRequest){
        Map<String,Object> body=new LinkedHashMap<>();
        body.put("timestamp", LocalDateTime.now());
        System.out.println(roleMismatch.getMessage());
        body.put("message", "Given Date format doesn't match expected : 2021-02-08T12:00:10+05:30");

        return new ResponseEntity<>(body, HttpStatus.NOT_ACCEPTABLE);
    }
}

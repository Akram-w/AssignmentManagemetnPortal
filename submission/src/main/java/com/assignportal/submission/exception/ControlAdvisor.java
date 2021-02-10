package com.assignportal.submission.exception;

import com.fasterxml.jackson.core.JsonProcessingException;
import model.exception.AlreadyRegisteredToCourse;
import model.exception.DeadLineException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeParseException;
import java.util.LinkedHashMap;
import java.util.Map;

@ControllerAdvice
public class ControlAdvisor extends ResponseEntityExceptionHandler {

    @ExceptionHandler(JsonProcessingException.class)
    public ResponseEntity<Object> handleCourseNotActive(
            JsonProcessingException courseNotActive, WebRequest request){
        Map<String,Object> body=new LinkedHashMap<>();
        body.put("timestamp", LocalDateTime.now());
        body.put("message", "Given Data not acceptable");

        return new ResponseEntity<>(body, HttpStatus.NOT_ACCEPTABLE);
    }

    @ExceptionHandler(IOException.class)
    public ResponseEntity<Object> handleCourseNotExists(
            IOException courseNotExists, WebRequest request){
        Map<String,Object> body=new LinkedHashMap<>();
        body.put("timestamp", LocalDateTime.now());
        body.put("message", "something went wrong try again later");

        return new ResponseEntity<>(body, HttpStatus.NOT_ACCEPTABLE);
    }
    @ExceptionHandler(DateTimeParseException.class)
    public ResponseEntity<Object> handleAlreadyRegisteredToCourse(
            DateTimeParseException alreadyRegisteredToCourse,WebRequest webRequest){
        Map<String,Object> body=new LinkedHashMap<>();
        body.put("timestamp", LocalDateTime.now());
        body.put("message", "Given date not matched");

        return new ResponseEntity<>(body, HttpStatus.NOT_ACCEPTABLE);
    }
    @ExceptionHandler(DeadLineException.class)
    public ResponseEntity<Object> handleAlreadyRegisteredToCourse(
            DeadLineException alreadyRegisteredToCourse,WebRequest webRequest){
        Map<String,Object> body=new LinkedHashMap<>();
        body.put("timestamp", LocalDateTime.now());
        body.put("message", alreadyRegisteredToCourse.getMessage());

        return new ResponseEntity<>(body, HttpStatus.NOT_ACCEPTABLE);
    }

    @ExceptionHandler(FileNotFoundException.class)
    public ResponseEntity<Object> handleAlreadyRegisteredToCourse(
            FileNotFoundException alreadyRegisteredToCourse,WebRequest webRequest){
        Map<String,Object> body=new LinkedHashMap<>();
        body.put("timestamp", LocalDateTime.now());
        body.put("message", alreadyRegisteredToCourse.getMessage());

        return new ResponseEntity<>(body, HttpStatus.NOT_ACCEPTABLE);
    }
}

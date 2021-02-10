package com.assignportal.subjects.exceptions;

import model.exception.CourseNotActive;
import model.exception.CourseNotExists;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

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
}

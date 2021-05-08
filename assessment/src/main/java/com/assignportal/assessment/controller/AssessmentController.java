package com.assignportal.assessment.controller;

import com.assignportal.assessment.servicer.AssessmentService;
import com.fasterxml.jackson.databind.ObjectMapper;
import model.assessment.Assessment;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.net.URL;
import java.util.List;

@RestController
public class AssessmentController {

    @Autowired
    AssessmentService assessmentService;

    @PostMapping(value = "/assessments", produces = "application/json", consumes = "multipart/form-data")
    @PreAuthorize("hasAuthority('create_assessments')")
    public Assessment saveAssessment(@RequestPart("file") MultipartFile file,
                                     @RequestPart("data") String course) throws IOException {
        System.out.println(course);
        Assessment assessment = new ObjectMapper().readValue(course, Assessment.class);
        return assessmentService.save(file, assessment);
    }

    @GetMapping(value = "/assessments/{id}")
    @PreAuthorize("hasAuthority('read_assessments')")
    public ResponseEntity<Assessment> getAssessment(@PathVariable int id) {
        Assessment assessment = assessmentService.getAssessmentById(id);

        if (assessment == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new Assessment());
        }
        return ResponseEntity.status(HttpStatus.OK).body(assessment);
    }

    @GetMapping(value = "/assessments/{id}/download")
    @PreAuthorize("hasAuthority('read_assessments')")
    public ResponseEntity downloadAssessment(@PathVariable int id) throws FileNotFoundException {
        URL download = assessmentService.download(id);
        if (download != null) {
            HttpHeaders headers = new HttpHeaders();
            headers.add(HttpHeaders.LOCATION,download.toString());
            headers.add("Access-Control-Allow-Origin","https://storage.googleapis.com/");
            return ResponseEntity.status(HttpStatus.OK).body(download.toString());
        }
        return null;
    }

    @GetMapping(value = "/assessments",params = "modelId")
    @PreAuthorize("hasAuthority('read_assessments')")
    public List<Assessment> getAllAssessmentsByModuleId(@RequestParam(value = "modelId") int id){
        return assessmentService.getAssessmentByModuleId(id);
    }
    @GetMapping(value = "/assessments/{id}",params = "submittingDate")
    @PreAuthorize("hasAuthority('read_assessments')")
    public boolean checkDeadline(@PathVariable int id,
            @RequestParam(name = "submittingDate")String date){
        return assessmentService.checkDeadLine(id,date);
    }
    @DeleteMapping(value = "/assessments/{id}")
    @PreAuthorize("hasAuthority('delete_assessments')")
    public ResponseEntity<String> deleteAssessment(@PathVariable int id){
        String delete = assessmentService.delete(id);

        if(delete==null){
           return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Couldn't find given assessment");
        }
        return ResponseEntity.status(HttpStatus.OK).body("Assessment deleted");
    }
    @PutMapping(value = "/assessments/{id}", produces = "application/json", consumes = "multipart/form-data")
    @PreAuthorize("hasAuthority('update_assessments')")
    public ResponseEntity<Assessment> updateAssessment(@PathVariable int id,
                                                       @RequestPart(value = "file",required = false) MultipartFile file,
                                       @RequestPart("data") String course) throws IOException {

        Assessment assessment = new ObjectMapper().readValue(course, Assessment.class);
        System.out.println(file.isEmpty());
        Assessment updateAssessment =assessmentService.updateAssessment(assessment,file,id);

        if(updateAssessment==null){
           return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new Assessment());
        }
        return ResponseEntity.status(HttpStatus.OK).body(updateAssessment);
    }
}

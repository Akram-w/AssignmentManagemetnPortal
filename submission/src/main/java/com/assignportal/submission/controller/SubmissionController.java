package com.assignportal.submission.controller;

import com.assignportal.submission.servicer.SubmissionService;
import com.fasterxml.jackson.databind.ObjectMapper;
import model.submission.Submission;
import org.apache.http.HttpHeaders;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.net.URL;
import java.util.List;
import java.util.concurrent.ExecutionException;

@RestController
public class SubmissionController {

    @Autowired
    SubmissionService submissionService;

    @PostMapping(value = "/submissions",produces = "application/json", consumes = "multipart/form-data")
    @PreAuthorize("hasAuthority('create_submission')")
    public Submission saveSubmission(@RequestPart("file")MultipartFile file
            ,@RequestPart("data")String submitData)
            throws IOException, InterruptedException, ExecutionException {

        Submission submission = new ObjectMapper().readValue(submitData, Submission.class);
        return submissionService.save(file,submission);
    }

    @GetMapping(value = "/submissions/{id}")
    @PreAuthorize("hasAuthority('read_submission')")
    public ResponseEntity<Submission> getSubmissionById(@PathVariable int id){
        Submission byId = submissionService.getSubmissionById(id);

        if(byId==null){
           return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new Submission());
        }
        return ResponseEntity.status(HttpStatus.OK).body(byId);
    }

    @GetMapping(value = "/submissions/{id}/download")
    @PreAuthorize("hasAuthority('read_submission')")
    public ResponseEntity downloadSubmission(@PathVariable int id) throws FileNotFoundException {
        URL url=submissionService.download(id);
        if(url!=null){
            return ResponseEntity.status(HttpStatus.MOVED_PERMANENTLY)
                    .header(HttpHeaders.LOCATION,url.toString()).build();
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("couldn't find given submission");
    }

    @GetMapping(value = "/submissions",params = "assessmentId")
    @PreAuthorize("hasAuthority('read_submission')")
    public List<Submission> getSubmissionByAssessmentId(@RequestParam(value = "assessmentId") int id){
        return submissionService.getSubmissionAssessmentId(id);
    }
    @GetMapping(value = "/submissions",params ={"assessmentId","studentName"})
    @PreAuthorize("hasAuthority('read_submission')")
    public ResponseEntity<Submission> getStudentSubmission(@RequestParam(value = "assessmentId") int id,
                                                           @RequestParam(value = "studentName")String name){
        Submission submission=submissionService.getStudentSubmission(id,name);

        if(submission!=null){
            return ResponseEntity.status(HttpStatus.OK).body(submission);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new Submission());
    }

    @DeleteMapping(value = "/submissions/{id}")
    @PreAuthorize("hasAuthority('delete_submission')")
    public ResponseEntity<String> deleteSubmission(@PathVariable int id){
        String delete=submissionService.delete(id);

        if(delete==null){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("couldn't find given submission");
        }
        return ResponseEntity.status(HttpStatus.OK).body("Submission deleted");
    }

    @PutMapping(value = "/submissions/{id}", produces = "application/json", consumes = "multipart/form-data")
    @PreAuthorize("hasAuthority('update_submission')")
    public ResponseEntity<Submission> updateSubmission(@PathVariable int id,
                                                       @RequestPart(value = "file",required = false) MultipartFile file,
                                                       @RequestPart("data") String submitData)
            throws IOException {
        Submission submission = new ObjectMapper().readValue(submitData, Submission.class);
        Submission updated=submissionService.updateSubmission(submission,file,id);

        if(updated==null){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new Submission());
        }
        return ResponseEntity.status(HttpStatus.OK).body(updated);
    }
}

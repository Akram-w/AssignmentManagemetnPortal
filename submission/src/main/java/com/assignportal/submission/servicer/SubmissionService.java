package com.assignportal.submission.servicer;

import model.submission.Submission;
import org.springframework.web.multipart.MultipartFile;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.net.URL;
import java.util.List;
import java.util.concurrent.ExecutionException;

public interface SubmissionService {
    Submission save(MultipartFile file, Submission submission) throws IOException, ExecutionException, InterruptedException;

    Submission getSubmissionById(int id);

    URL download(int id) throws FileNotFoundException;

    List<Submission> getSubmissionAssessmentId(int id);

    String delete(int id);

    Submission updateSubmission(Submission submission, MultipartFile file, int id) throws IOException;

    Submission getStudentSubmission(int id, String name);
}

package com.assignportal.assessment.servicer;

import model.assessment.Assessment;
import org.springframework.web.multipart.MultipartFile;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.net.URL;
import java.util.List;

public interface AssessmentService {

     Assessment save(MultipartFile file, Assessment assessment) throws IOException;

     String delete(int id);
     URL download(int id) throws FileNotFoundException;

    Assessment getAssessmentById(int id);

    Assessment updateAssessment(Assessment course, MultipartFile file, int id) throws IOException;

    List<Assessment> getAssessmentByModuleId(int id);

    boolean checkDeadLine(int id, String date);
}

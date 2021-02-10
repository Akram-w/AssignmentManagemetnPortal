package com.assignportal.assessment.servicer;

import com.assignportal.assessment.repository.AssessmentRepository;
import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.storage.*;
import model.assessment.Assessment;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.net.URL;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.TimeUnit;

@Service
public class AssessmentServiceImpl implements AssessmentService {

    private Storage storage;

    @Autowired
    AssessmentRepository repository;

    @EventListener
    public void init(ApplicationReadyEvent event) throws IOException {
        ClassPathResource resource = new ClassPathResource("service-account-file.json");
        storage = StorageOptions
                .newBuilder()
                .setCredentials(GoogleCredentials.fromStream(resource.getInputStream()))
                .setProjectId("assign-portal-304303").build().getService();
    }

    @Override
    public Assessment save(MultipartFile file, Assessment assessment) throws IOException {
        if(!(file.isEmpty())) {
            checkDateFormat(assessment.getSubmissionDate());
            String uploadedFileName = upload(file, assessment.getPath());
            assessment.setPath(uploadedFileName);

            return repository.save(assessment);
        }
        throw new FileNotFoundException("Couldn't find file from given Assessment");
    }
    private void checkDateFormat(String date){
        DateTimeFormatter formatter= DateTimeFormatter.ofPattern("yyyy-MM-dd");
        LocalDate submissionDate = LocalDate.parse(date, formatter);
    }
    @Override
    public Assessment getAssessmentById(int id) {
        Optional<Assessment> byId = repository.findById(id);

        return byId.isPresent() ? byId.get() : null;
    }

    @Override
    public URL download(int id) throws FileNotFoundException {
        Optional<Assessment> byId = repository.findById(id);
        if (byId.isPresent()) {
            String imageName = byId.get().getPath();
            Blob blob1 = storage.get(BlobId.of("assign-portal-304303.appspot.com", imageName));
            URL url;
            try {
                 url = blob1.signUrl(5, TimeUnit.MINUTES);
            }catch (NullPointerException nullPoint){
                throw new FileNotFoundException("Couldn't find File");
            }
            System.out.println("download link" + url);
            return url;
        }
        return null;
    }

    @Override
    public Assessment updateAssessment(Assessment course, MultipartFile file, int id) throws IOException {
        Assessment assessmentById = getAssessmentById(id);
        if(assessmentById!=null){
            System.out.println(assessmentById.getId());
            if(!(file.isEmpty())) {
                boolean delete = deleteFile(assessmentById.getPath());
                if (delete) {
                    String fileName = upload(file,assessmentById.getPath());
                    course.setPath(fileName);
                    course.setId(assessmentById.getId());

                    return repository.save(course);
                }
            }else{
                course.setId(assessmentById.getId());
                course.setPath(assessmentById.getPath());
                return repository.save(course);
            }
        }
        return null;
    }

    @Override
    public List<Assessment> getAssessmentByModuleId(int id) {
        return repository.findByModelId(id);
    }

    @Override
    public String delete(int id) {
        Assessment assessmentById = getAssessmentById(id);
        if(assessmentById!=null){
            boolean delete = deleteFile(assessmentById.getPath());
            if(delete){
                repository.deleteById(id);
                return "done";
            }
        }
        return null;
    }

    @Override
    public boolean checkDeadLine(int id, String date) {
        Assessment byId = getAssessmentById(id);
        if(byId!=null){
            DateTimeFormatter formatter= DateTimeFormatter.ofPattern("yyyy-MM-dd");
            String[] ts1 =date.split("T");
            LocalDate submissionDate = LocalDate.parse(ts1[0], formatter);
            String[] ts = byId.getSubmissionDate().split("T");
            LocalDate assessmentDate = LocalDate.parse(ts[0],formatter);

            System.out.println(submissionDate+"submissionDate");
            System.out.println(assessmentDate+"assessmentDate");

            boolean beforeCheck = submissionDate.isBefore(assessmentDate);
            boolean equalCheck = assessmentDate.isEqual(submissionDate);

            if(beforeCheck || equalCheck){
                return true;
            }
        }
        return false;
    }

    private boolean deleteFile(String path){
        BlobId blobId = storage.get("assign-portal-304303.appspot.com"
                ,path).getBlobId();
        boolean delete = storage.delete(blobId);
        System.out.println(delete);
        return delete;
    }
    private String upload(MultipartFile file,String filePath) throws IOException {

        String fileName = generateFileName(file.getOriginalFilename());
        String imageName=filePath+"/"+fileName;



        Storage storage1 = StorageOptions.newBuilder().setProjectId("assign-portal-304303").build().getService();
        BlobId blobId = BlobId.of("assign-portal-304303.appspot.com", imageName);
        BlobInfo blobInfo = BlobInfo.newBuilder(blobId).build();
        Blob blob = storage.create(blobInfo, file.getBytes());
        System.out.println(blob.getMediaLink());

        System.out.println("image uploaded" + imageName);


        return imageName;
    }

    private String generateFileName(String originalFileName) {
        return LocalDate.now().toString().concat("-").concat(originalFileName);
    }
}

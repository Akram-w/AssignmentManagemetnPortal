package com.assignportal.submission.servicer;

import com.assignportal.submission.repository.SubmissionRepository;
import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.storage.*;
import model.exception.DeadLineException;
import model.hystix.CommonHystrixCommand;
import model.submission.Submission;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.net.URL;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.Future;
import java.util.concurrent.TimeUnit;

@Service
public class SubmissionServiceImpl implements SubmissionService {

    private Storage storage;

    @Autowired
    RestTemplate restTemplate;

    @Autowired
    SubmissionRepository repository;

    @EventListener
    public void init(ApplicationReadyEvent event) throws IOException {
        ClassPathResource resource = new ClassPathResource("service-account-file.json");
        storage = StorageOptions
                .newBuilder()
                .setCredentials(GoogleCredentials.fromStream(resource.getInputStream()))
                .setProjectId("assign-portal-304303").build().getService();
    }

    @Override
    public Submission save(MultipartFile file, Submission submission)
            throws IOException, ExecutionException, InterruptedException {
        if (!(file.isEmpty())) {
            String dateFormat = checkDateFormat(submission.getSubmissionDate());
            Boolean deadLine = checkDeadLine(dateFormat, submission.getAssessmentId());
            if (deadLine) {
                String fileName = upload(file, submission);
                submission.setFileName(fileName);

                return repository.save(submission);
            } else {
                throw new DeadLineException("Unable to submit DeadLine is over");
            }
        }
        throw new FileNotFoundException("couldn't find file in submission");
    }

    @Override
    public Submission getSubmissionById(int id) {
        Optional<Submission> byId = repository.findById(id);

        return byId.isPresent() ? byId.get() : null;
    }

    @Override
    public URL download(int id) throws FileNotFoundException {
        Optional<Submission> byId = repository.findById(id);
        if (byId.isPresent()) {
            String imageName = byId.get().getBasePath() + "/" + byId.get().getFileName();
            Blob blob1 = storage.get(BlobId.of("assign-portal-304303.appspot.com", imageName));
            URL url;
            try {
                url = blob1.signUrl(5, TimeUnit.MINUTES);
            } catch (NullPointerException exception) {
                throw new FileNotFoundException("couldn't find file");
            }
            System.out.println("download link" + url);
            return url;
        }
        return null;
    }

    @Override
    public List<Submission> getSubmissionAssessmentId(int id) {
        return repository.findByAssessmentId(id);
    }

    @Override
    public Submission getStudentSubmission(int id, String name) {
        Optional<Submission> studentSubmission = repository.findByAssessmentIdAndStudentName(id, name);

        return studentSubmission.isPresent() ? studentSubmission.get() : null;
    }

    @Override
    public String delete(int id) {
        Submission byId = getSubmissionById(id);
        if (byId != null) {
            boolean delete = deleteFile(byId.getBasePath(), byId.getFileName());
            if (delete) {
                repository.deleteById(id);
                return "done";
            }
        }
        return null;
    }

    @Override
    public Submission updateSubmission(Submission submission, MultipartFile file, int id) throws IOException {
        Submission submissionById = getSubmissionById(id);
        if (submissionById != null) {
            if (!(file.isEmpty())) {
                boolean delete = deleteFile(submissionById.getBasePath(), submissionById.getFileName());
                if (delete) {
                    String fileName = upload(file, submissionById);
                    submission.setFileName(fileName);
                    submission.setBasePath(submissionById.getBasePath());
                    submission.setId(submissionById.getId());

                    return repository.save(submission);
                }
            } else {
                submission.setBasePath(submissionById.getBasePath());
                submission.setFileName(submissionById.getFileName());
                submission.setId(submissionById.getId());
                return repository.save(submission);
            }
        }
        return null;
    }

    private boolean deleteFile(String basePath, String fileName) {
        String path = basePath + "/" + fileName;
        BlobId blobId = storage.get("assign-portal-304303.appspot.com"
                , path).getBlobId();
        boolean delete = storage.delete(blobId);
        System.out.println(delete);
        return delete;
    }

    //file path  should be assign-portal/{tutorName}/{courseName/{moduleName}/submission/{assessmentId}
    // /{studentName}/fileName
    private String upload(MultipartFile file, Submission basePath) throws IOException {
        String imageName = basePath.getBasePath() + "/" + file.getOriginalFilename();

        BlobId blobId = BlobId.of("assign-portal-304303.appspot.com", imageName);
        BlobInfo blobInfo = BlobInfo.newBuilder(blobId).build();
        Blob blob = storage.create(blobInfo, file.getBytes());
        System.out.println(blob.getMediaLink());


        System.out.println("image uploaded" + imageName);


        return file.getOriginalFilename();
    }

    private String checkDateFormat(String date) {
        String[] ts = date.split("T");
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        LocalDate submissionDate = LocalDate.parse(ts[0], formatter);
        return ts[0];
    }

    private Boolean checkDeadLine(String submissionDate, int assessmentId)
            throws ExecutionException, InterruptedException {
        CommonHystrixCommand<Boolean> deadLineHystrix = new CommonHystrixCommand<Boolean>("default",
                () -> {
                    String uri = "http://localhost:8080/assessments/" + assessmentId + "?submittingDate=" + submissionDate;
                    return restTemplate.getForObject(uri, boolean.class);
                },
                () -> {
                    System.out.println("failed");
                    return Boolean.FALSE;
                });
        Future<Boolean> deadLineFuture = deadLineHystrix.queue();
        return deadLineFuture.get();
    }
}

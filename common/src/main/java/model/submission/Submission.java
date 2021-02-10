package model.submission;

import lombok.Data;

import javax.persistence.*;

@Entity
@Table(name = "submission")
@Data
public class Submission {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private int id;

    private String studentName;
    private int assessmentId;
    private String submissionDate;
    private String basePath;
    private String fileName;
}

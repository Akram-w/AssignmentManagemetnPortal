package model.assessment;

import lombok.Data;

import javax.persistence.*;

@Entity
@Table(name = "Assessment")
@Data
public class Assessment {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private int id;

    private String assessmentName;
    private String submissionDate;
    private String path;
    private int modelId;
}

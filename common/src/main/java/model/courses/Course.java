package model.courses;

import lombok.Data;

import javax.persistence.*;

@Entity
@Table(name = "course")
@Data
public class Course {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private int id;
    private String courseName;
    private String courseDescription;
    private String tutorName;
    private boolean isActive;

}

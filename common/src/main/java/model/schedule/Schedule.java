package model.schedule;

import lombok.Data;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "schedule")
@Data
public class Schedule {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private int id;

    private int courseId;
    private String courseName;
    private String description;
    private LocalDateTime startsAt;
    private LocalDateTime endsAt;
}

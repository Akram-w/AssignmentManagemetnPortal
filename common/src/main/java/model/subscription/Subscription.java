package model.subscription;

import lombok.Data;

import javax.persistence.*;

@Entity
@Table(name = "subscription")
@Data
public class Subscription {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private int id;

    private String studentName;
    private int courseId;
    private boolean accepted;
    private boolean banned;
}

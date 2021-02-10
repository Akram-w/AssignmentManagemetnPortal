package model.modules;

import lombok.Data;

import javax.persistence.*;

@Entity
@Table(name = "module")
@Data
public class Module {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private int id;

    private String moduleName;
    private String moduleDescription;
    private int courseId;
    private boolean isActive;
}

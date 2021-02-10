package model.attendance;

import lombok.Data;

import javax.persistence.Embeddable;
import java.io.Serializable;
import java.time.LocalDate;
import java.time.ZonedDateTime;

@Embeddable
@Data
public class AttendanceId implements Serializable {
    private String studentName;
    private int courseId;
    private String attendingDate;

    public AttendanceId() {
    }

    public AttendanceId(String studentName, int courseId, String attendingDate) {
        this.studentName = studentName;
        this.courseId = courseId;
        this.attendingDate = attendingDate;
    }
}

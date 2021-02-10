package model.attendance;

import lombok.Data;

import javax.persistence.EmbeddedId;
import javax.persistence.Entity;
import javax.persistence.Table;

@Entity
@Table(name = "attendance")
@Data
public class Attendance {

    @EmbeddedId
    private AttendanceId attendanceId;
    private boolean isAttended;
}

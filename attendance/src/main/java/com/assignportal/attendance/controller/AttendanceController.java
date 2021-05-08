package com.assignportal.attendance.controller;

import com.assignportal.attendance.servicer.AttendanceService;
import model.attendance.Attendance;
import model.attendance.AttendanceId;
import model.responseModels.AttendanceWithCourse;
import model.responseModels.CourseWithAttendanceList;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutionException;

@RestController
public class AttendanceController {

    @Autowired
    AttendanceService attendanceService;

    /*
        Endpoint to save attendance
        @RequestBody attendance
     */
    @PostMapping(value = "/attendances")
    @PreAuthorize("hasAuthority('create_attendance')")
    public Attendance saveAttendance(@RequestBody Attendance attendance)
            throws ExecutionException, InterruptedException {
        Attendance save = attendanceService.save(attendance,"save");

        return save == null ? new Attendance() : save;
    }

    /*
        Endpoint to save attendance as list
        @RequestBody list ofattendance
     */
    @PostMapping(value = "/attendances",params = "isList")
    @PreAuthorize("hasAuthority('create_attendance')")
    public List<Attendance> saveAttendanceAsList(@RequestParam(value = "isList")boolean list,
                                     @RequestBody List<Attendance> attendance)
            throws ExecutionException, InterruptedException {
        List<Attendance> attendances = attendanceService.saveList(attendance);

        return attendances == null ? new ArrayList<Attendance>() : attendances;
    }

    /*
        Endpoint to update attendance
        @PathVariable attendanceId
        @RequestBody attendance
     */
    @PutMapping(value = "/attendances/{studentName}/{courseId}/{attendingDate}")
    @PreAuthorize("hasAuthority('update_attendance')")
    public Attendance updateAttendance(@PathVariable String studentName,@PathVariable int courseId,
                                       @PathVariable String attendingDate, @RequestBody Attendance attendance)
            throws ExecutionException, InterruptedException {
        AttendanceId attendanceId=new AttendanceId(studentName,courseId,attendingDate);
        return attendanceService.update(attendance, attendanceId);
    }

    /*
       Endpoint to Delete attendance
       @PathVariable attendanceId
    */
    @DeleteMapping(value = "/attendances/{studentName}/{courseId}/{attendingDate}")
    @PreAuthorize("hasAuthority('delete_attendance')")
    public ResponseEntity<String> deleteAttendance(@PathVariable String studentName,@PathVariable int courseId,
                                                   @PathVariable String attendingDate) {
        try {
            AttendanceId attendanceId=new AttendanceId(studentName,courseId,attendingDate);

            attendanceService.delete(attendanceId);
            return ResponseEntity.status(HttpStatus.OK).body("Attendance has deleted");
        } catch (
                EmptyResultDataAccessException erda) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Couldn't find given Attendance");
        }
    }

    /*
       Endpoint to Get All attendance
    */
    @GetMapping(value = "/attendances")
    @PreAuthorize("hasAuthority('read_attendance')")
    public List<Attendance> getAllAttendance() {
        return attendanceService.getAllAttendances();
    }

    /*
        Endpoint to get all distinct dates
     */
    @GetMapping(value = "/attendances/dates",params = "courseId")
    @PreAuthorize("hasAuthority('read_attendance')")
    public List<String> getDistinctDated(@RequestParam int courseId){
        return attendanceService.getDistinctDates(courseId);
    }
    /*
        Endpoint to get all attendance by course id and date
     */
    @GetMapping(value = "/attendances",params ={"courseId","date"})
    @PreAuthorize("hasAuthority('read_attendance')")
    public List<Attendance> getAttendanceByDateAndCourseId(@RequestParam(value = "courseId") int courseId,
                                                       @RequestParam(value = "date")String date){
        return attendanceService.getAttendanceByDateAndCourse(date,courseId);
    }
    //create get endpoint with date and couseid and date to get all attendances
    /*
        Endpoint to get attendance by id
        @PathVariable attendanceId
     */
    @GetMapping(value = "/attendances/{studentName}/{courseId}/{attendingDate}")
    @PreAuthorize("hasAuthority('read_attendance')")
    public ResponseEntity<AttendanceWithCourse> getAttendanceById(@PathVariable String studentName,
                                                                  @PathVariable int courseId,
                                                                  @PathVariable String attendingDate)
            throws ExecutionException, InterruptedException {
        AttendanceId attendanceId=new AttendanceId(studentName,courseId,attendingDate);
        AttendanceWithCourse attendanceById = attendanceService.getAttendanceById(attendanceId);

        if (attendanceById == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new AttendanceWithCourse());
        }
        return ResponseEntity.status(HttpStatus.OK).body(attendanceById);
    }

    /*
        Endpoint to get All Attendance by studentName
        @RequestParam studentName
     */
    @GetMapping(value = "/attendances", params = "studentName")
    @PreAuthorize("hasAuthority('read_attendance')")
    public ResponseEntity<List<AttendanceWithCourse>> getAllAttendanceByStudentId(
            @RequestParam String studentName) throws ExecutionException, InterruptedException {

        List<AttendanceWithCourse> attendanceByStudentName = attendanceService.
                getAttendanceByStudentName(studentName);

        if (attendanceByStudentName == null) {
            ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ArrayList<AttendanceWithCourse>());
        }
        return ResponseEntity.status(HttpStatus.OK).body(attendanceByStudentName);

    }

    /*
        Endpoint to get all attendance by courseId
        @RequestParam courseId
     */
    @GetMapping(value = "/attendances", params = "courseId")
    @PreAuthorize("hasAuthority('read_attendance')")
    public ResponseEntity<CourseWithAttendanceList> getAllAttendanceByCourseId(@RequestParam int courseId)
            throws ExecutionException, InterruptedException {

        CourseWithAttendanceList attendanceByCourseId = attendanceService.getAttendanceByCourseId(courseId);

        if (attendanceByCourseId == null) {
            ResponseEntity.status(HttpStatus.NOT_FOUND).body(new CourseWithAttendanceList());
        }
        return ResponseEntity.status(HttpStatus.OK).body(attendanceByCourseId);
    }

}

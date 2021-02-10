package com.assignportal.schedule.controller;

import com.assignportal.schedule.servicer.ScheduleService;
import model.exception.RoleMismatch;
import model.responseModels.ScheduleWithCourse;
import model.schedule.Schedule;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.concurrent.ExecutionException;

@RestController
public class ScheduleController {

    @Autowired
    ScheduleService scheduleService;

    /*
        Endpoint to save schedule
        @RequestBody Schedule
     */
    @PostMapping(value = "/schedules")
    public Schedule saveSchedule(@RequestBody Schedule schedule)
            throws ExecutionException, InterruptedException {
        Schedule savedSchedule = scheduleService.save(schedule, "update");
        return (savedSchedule == null) ? new Schedule() : savedSchedule;
    }

    /*
        Endpoint to update schedule
        @PathVariable subscriptionId
        @RequestBody Schedule
     */
    @PutMapping(value = "/schedules/{id}")
    public Schedule updateSchedule(@RequestBody Schedule subscription,
                                   @PathVariable int id)
            throws ExecutionException, InterruptedException {

        Schedule updatedSubscription = scheduleService.update(subscription, id);

        return updatedSubscription;
    }

    /*
       Endpoint to Delete schedule
       @PathVariable scheduleId
    */
    @DeleteMapping(value = "/schedules/{id}")
    public ResponseEntity deleteSubscription(@PathVariable int id) {
        try {
            scheduleService.delete(id);
            return ResponseEntity.status(HttpStatus.OK).body("Schedule has deleted");
        } catch (EmptyResultDataAccessException erda) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Couldn't find given Schedule");
        }
    }

    /*
       Endpoint to get All schedule
    */
    @GetMapping(value = "/schedules")
    public List<Schedule> getAllSchedule() {
        return scheduleService.getAllSubscriptions();
    }

    /*
        Endpoint to get schedule by id
        @PathVariable scheduleId
     */
    @GetMapping(value = "/schedules/{id}")
    public ResponseEntity<ScheduleWithCourse> getScheduleById(@PathVariable int id)
            throws ExecutionException, InterruptedException {
        ScheduleWithCourse scheduleById = scheduleService.getScheduleById(id);
        if (scheduleById == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ScheduleWithCourse());
        } else {
            return ResponseEntity.status(HttpStatus.OK).body(scheduleById);
        }
    }

    /*
        Endpoint to get schedule current Month
        @RequestParam currentDate
        @RequestParam tutor or student name
        @RequestParam role (student or tutor)
     */
    @GetMapping(value = "/schedules",params = {"currentDate","name","role"})
    public List<Schedule> getScheduleByMonth (
            @RequestParam (value = "currentDate") @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate date,
                                                  @RequestParam(value = "name")String name,
                                                  @RequestParam(value = "role")String role)
            throws ExecutionException, InterruptedException {

        if(role.equalsIgnoreCase("student") ){
            return scheduleService.getScheduleByMonthForStudent(date,name);

        }else if(role.equalsIgnoreCase("tutor")){
            return scheduleService.getScheduleByMonthForTutor(date,name);
        }else {
            throw new RoleMismatch("Role should by either Student or Tutor");
        }
    }
}

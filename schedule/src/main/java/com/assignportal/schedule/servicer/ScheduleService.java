package com.assignportal.schedule.servicer;

import model.responseModels.ScheduleWithCourse;
import model.schedule.Schedule;

import java.time.LocalDate;
import java.util.List;
import java.util.concurrent.ExecutionException;

public interface ScheduleService {

    Schedule save(Schedule schedule, String update) throws ExecutionException, InterruptedException;
    Schedule update(Schedule subscription, int id) throws ExecutionException, InterruptedException;
    void delete(int id);
    List<Schedule> getAllSubscriptions();
    ScheduleWithCourse getScheduleById(int id) throws ExecutionException, InterruptedException;
    List<Schedule> getScheduleByMonthForStudent(LocalDate date, String name)
            throws ExecutionException, InterruptedException;
    List<Schedule> getScheduleByMonthForTutor(LocalDate date, String name) throws ExecutionException, InterruptedException;
}

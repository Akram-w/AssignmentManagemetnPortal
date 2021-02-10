package com.assignportal.schedule.repository;


import model.schedule.Schedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public interface ScheduleRepository extends JpaRepository<Schedule,Integer>{
   @Query("select sc from Schedule sc where sc.courseId=?1 and (?2 between sc.startsAt and sc.endsAt ) and (?2 between startsAt and endsAt) ")
   List<Schedule> findByCourseIdAndStartsAtGreaterThanEqualAndEndsAtLessThanEqual
           (int courseId,LocalDateTime startDate,LocalDateTime endDate);

   List<Schedule> findByCourseIdInAndStartsAtGreaterThanEqualAndEndsAtLessThanEqual
           (List<Integer> idList, LocalDateTime starDate, LocalDateTime endDate);
}

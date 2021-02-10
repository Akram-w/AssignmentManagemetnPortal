package com.assignportal.schedule.servicer;

import com.assignportal.schedule.repository.ScheduleRepository;
import model.courses.Course;
import model.exception.CourseAlreadyScheduled;
import model.exception.CourseNotActive;
import model.exception.CourseNotExists;
import model.hystix.CommonHystrixCommand;
import model.responseModels.CoursesWithModule;
import model.responseModels.ScheduleWithCourse;
import model.responseModels.SubscriptionsWithCourses;
import model.schedule.Schedule;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.Future;
import java.util.stream.Collectors;

@Service
public class ScheduleServiceImpl implements ScheduleService {

    @Autowired
    ScheduleRepository scheduleRepository;

    @Autowired
    RestTemplate restTemplate;

    @Override
    public Schedule save(Schedule schedule, String update) throws ExecutionException, InterruptedException {
        String courseStatus = isActiveCourse(schedule.getCourseId());

        if (courseStatus.equals("ACTIVE")) {

            List<Schedule> listOfClashingSchedules = scheduleRepository.findByCourseIdAndStartsAtGreaterThanEqualAndEndsAtLessThanEqual
                    (schedule.getCourseId(), schedule.getStartsAt(), schedule.getEndsAt());
            if (listOfClashingSchedules.isEmpty()) {
                return scheduleRepository.save(schedule);
            } else {
                System.out.println(listOfClashingSchedules.toString());

                long count = listOfClashingSchedules.stream()
                        .filter(schedule1 -> schedule1.getId() != schedule.getId())
                        .count();
                System.out.println(count);
                if (count == 0) {
                    return scheduleRepository.save(schedule);
                }
            }
            throw new CourseAlreadyScheduled("given course is already scheduled in given timeslot");
        } else if (courseStatus.equals("NOT-ACTIVE")) {
            throw new CourseNotActive("Course under id : " + schedule.getCourseId() + " not active");
        } else if (courseStatus.equals("NOT-FOUND")) {
            throw new CourseNotExists("Course under id: " + schedule.getCourseId() + " not Found");
        }
        return null;
    }

    private String isActiveCourse(int courseId) throws ExecutionException, InterruptedException {
        CommonHystrixCommand<String> statusHystrixCommand = new CommonHystrixCommand<String>
                ("default", () ->
                {
                    String uri = "http://localhost:8080/courses/" + courseId + "/isActive";
                    return restTemplate.getForObject(uri, String.class);
                }, () -> {
                    System.out.println("inside not found");
                    return "NOT-FOUND";
                });

        Future<String> statusFuture = statusHystrixCommand.queue();
        String s = statusFuture.get();
        System.out.println(s);
        return s;
    }

    @Override
    public Schedule update(Schedule schedule, int id) throws ExecutionException, InterruptedException {
        schedule.setId(id);
        return save(schedule, "update");
    }

    @Override
    public void delete(int id) {
        scheduleRepository.deleteById(id);
    }

    @Override
    public List<Schedule> getAllSubscriptions() {
        return scheduleRepository.findAll();
    }

    @Override
    public ScheduleWithCourse getScheduleById(int id) throws ExecutionException, InterruptedException {
        Optional<Schedule> byId = scheduleRepository.findById(id);
        if (byId.isPresent()) {
            Schedule schedule = byId.get();
            CoursesWithModule courseById = getCourseById(schedule.getCourseId());

            return new ScheduleWithCourse(schedule, courseById.getCourse());
        }
        return null;
    }

    private CoursesWithModule getCourseById(int courseId) throws ExecutionException, InterruptedException {
        CommonHystrixCommand<CoursesWithModule> courseHystrixCommand =
                new CommonHystrixCommand<CoursesWithModule>("default", () ->
                {
                    String uri = "http://localhost:8080/courses/" + courseId;
                    return restTemplate.getForObject(uri, CoursesWithModule.class);
                }, () -> {
                    return new CoursesWithModule();
                });
        Future<CoursesWithModule> courseFuture = courseHystrixCommand.queue();
        return courseFuture.get();
    }

    @Override
    public List<Schedule> getScheduleByMonthForStudent(LocalDate date, String name)
            throws ExecutionException, InterruptedException {
        //getting start and end date from given date in param
        LocalDateTime monthStart = date.withDayOfMonth(1).atStartOfDay();
        LocalDateTime monthEnd = date.withDayOfMonth(date.getMonth().length(date.isLeapYear())).atTime(23, 59);

        //fetching the list of subscribed course ids from given studentName
        List<SubscriptionsWithCourses> subsList = Arrays.asList(getSubscriptionListByStudentName(name));
        if (!(subsList.isEmpty())) {
            List<Integer> subscribedCourseIdList = subsList.stream()
                    .map(subs -> subs.getCoursesWithModule().getCourse().getId())
                    .collect(Collectors.toList());

            return scheduleRepository
                    .findByCourseIdInAndStartsAtGreaterThanEqualAndEndsAtLessThanEqual
                            (subscribedCourseIdList, monthStart, monthEnd);
        }
        return new ArrayList<Schedule>();
    }

    private SubscriptionsWithCourses[] getSubscriptionListByStudentName(String name)
            throws ExecutionException, InterruptedException {

        CommonHystrixCommand<SubscriptionsWithCourses[]> courseHystrixCommand =
                new CommonHystrixCommand<SubscriptionsWithCourses[]>("default", () ->
                {
                    String uri = "http://localhost:8080/subscriptions/?studentName=" + name;
                    return restTemplate.getForObject(uri, SubscriptionsWithCourses[].class);
                }, () -> {
                    return new SubscriptionsWithCourses[0];
                });

        Future<SubscriptionsWithCourses[]> courseFuture = courseHystrixCommand.queue();
        return courseFuture.get();
    }

    @Override
    public List<Schedule> getScheduleByMonthForTutor(LocalDate date, String name)
            throws ExecutionException, InterruptedException {
        //getting start and end date from given date in param
        LocalDateTime monthStart = date.withDayOfMonth(1).atStartOfDay();
        LocalDateTime monthEnd = date.withDayOfMonth(date.getMonth().length(date.isLeapYear())).atTime(23, 59);

        System.out.println(monthStart.toString());
        System.out.println(monthEnd.toString());

        //fetching the list of subscribed course ids from given studentName
        List<Course> subsList = Arrays.asList(getSubscriptionListByTutorName(name));
        System.out.println(subsList);
        if (!(subsList.isEmpty())) {

            List<Integer> CourseIdList = subsList.stream()
                    .map(Course::getId)
                    .collect(Collectors.toList());

            return scheduleRepository
                    .findByCourseIdInAndStartsAtGreaterThanEqualAndEndsAtLessThanEqual
                            (CourseIdList, monthStart, monthEnd);
        }
        return new ArrayList<Schedule>();
    }

    private Course[] getSubscriptionListByTutorName(String name)
            throws ExecutionException, InterruptedException {

        CommonHystrixCommand<Course[]> courseHystrixCommand =
                new CommonHystrixCommand<Course[]>("default", () ->
                {
                    String uri = "http://localhost:8080/courses/?tutorName=" + name;
                    return restTemplate.getForObject(uri, Course[].class);
                }, () -> {
                    return new Course[0];
                });

        Future<Course[]> courseFuture = courseHystrixCommand.queue();
        return courseFuture.get();
    }
}

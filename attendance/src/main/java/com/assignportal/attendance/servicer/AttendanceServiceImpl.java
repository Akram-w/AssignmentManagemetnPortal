package com.assignportal.attendance.servicer;

import com.assignportal.attendance.config.AccessToken;
import com.assignportal.attendance.repository.AttendanceRepository;
import model.attendance.Attendance;
import model.attendance.AttendanceId;
import model.courses.Course;
import model.exception.AlreadyAttendanceMarked;
import model.exception.CourseNotActive;
import model.exception.CourseNotExists;
import model.hystix.CommonHystrixCommand;
import model.responseModels.AttendanceWithCourse;
import model.responseModels.CourseWithAttendanceList;
import model.responseModels.CoursesWithModule;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDate;
import java.time.ZonedDateTime;
import java.util.*;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.Future;
import java.util.function.BiFunction;
import java.util.stream.Collectors;

@Service
public class AttendanceServiceImpl<id, list> implements AttendanceService {

    @Autowired
    RestTemplate restTemplate;

    @Autowired
    AttendanceRepository repository;

    @Override
    public Attendance save(Attendance attendance, String type) throws ExecutionException, InterruptedException {
        String courseStatus = isActiveCourse(attendance.getAttendanceId().getCourseId());

        if (courseStatus.equals("ACTIVE")) {
            System.out.println(attendance.isAttended());

            if (type.equalsIgnoreCase("update")) {
                return repository.save(attendance);
            }

            System.out.println(attendance.getAttendanceId().getAttendingDate());
            String now = getAttendanceDate(attendance.getAttendanceId().getAttendingDate());
            System.out.println(now);
            attendance.getAttendanceId().setAttendingDate(now);
            if (repository.existsById(attendance.getAttendanceId())) {
                System.out.println("inside");
                throw new AlreadyAttendanceMarked("AlreadyAttendanceMarked to for this student");
            }
            return repository.save(attendance);
        } else if (courseStatus.equals("NOT-ACTIVE")) {
            throw new CourseNotActive("Course under id : " + attendance.getAttendanceId().getCourseId() + " not active");
        } else if (courseStatus.equals("NOT-FOUND")) {
            throw new CourseNotExists("Course under id: " + attendance.getAttendanceId().getCourseId() + " not Found");
        }
        return null;

    }

    private String getAttendanceDate(String attendingDate) {
        ZonedDateTime date = ZonedDateTime.parse(attendingDate);
        LocalDate now = LocalDate.now(date.getZone());
        return now.toString();
    }

    private String getAttendanceCustomDate(String attendingDate) {
        ZonedDateTime date = ZonedDateTime.parse(attendingDate);
        LocalDate now = LocalDate.now(date.getZone());
        return now.toString();
    }


    @Override
    public List<Attendance> saveList(List<Attendance> attendance) {

        List<Attendance> collect = attendance.stream().map(attendanceItem -> {
            attendanceItem.getAttendanceId()
                    .setAttendingDate(getAttendanceDate(attendanceItem.getAttendanceId().getAttendingDate()));
            return attendanceItem;
        }).collect(Collectors.toList());

        return repository.saveAll(collect);
    }

    private String isActiveCourse(int courseId) throws ExecutionException, InterruptedException {
        HttpHeaders headers = new HttpHeaders();
        headers.add("Authorization", AccessToken.getAccessToken());

        HttpEntity entity = new HttpEntity<>(headers);
        CommonHystrixCommand<String> statusHystrixCommand = new CommonHystrixCommand<String>
                ("default", () ->
                {
                    String uri = "http://localhost:8080/api/courses/" + courseId + "/isActive";
                    return restTemplate
                            .exchange(uri, HttpMethod.GET, entity, String.class)
                            .getBody();
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
    public Attendance update(Attendance attendance, AttendanceId attendanceId)
            throws ExecutionException, InterruptedException {
        String now = getAttendanceCustomDate(attendanceId.getAttendingDate());
        System.out.println(now);
        attendanceId.setAttendingDate(now);

        attendance.setAttendanceId(attendanceId);
        return save(attendance, "update");
    }

    @Override
    public void delete(AttendanceId attendanceId) {
        String now = getAttendanceCustomDate(attendanceId.getAttendingDate());
        attendanceId.setAttendingDate(now);

        repository.deleteById(attendanceId);
    }

    @Override
    public List<Attendance> getAllAttendances() {
        return repository.findAll();
    }

    @Override
    public List<String> getDistinctDates(int courseId) {
        List<Attendance> dates =
                repository.findDistinctAttendanceIdAttendingDateByAttendanceIdCourseId(courseId);
        System.out.println(dates);
        return dates.stream().map(attendance -> attendance
                .getAttendanceId().getAttendingDate())
                .collect(Collectors.toList());
    }

    @Override
    public List<Attendance> getAttendanceByDateAndCourse(String date, int courseId) {
        return repository.findByAttendanceIdAttendingDateAndAttendanceIdCourseId(date,courseId);
    }

    @Override
    public AttendanceWithCourse getAttendanceById(AttendanceId attendanceId)
            throws ExecutionException, InterruptedException {
        String now = getAttendanceCustomDate(attendanceId.getAttendingDate());
        attendanceId.setAttendingDate(now);

        Optional<Attendance> byId = repository.findById(attendanceId);
        if (byId.isPresent()) {
            CoursesWithModule courseById = getCourseById(attendanceId.getCourseId());
            System.out.println("insidenot");
            return new AttendanceWithCourse(byId.get(), courseById);
        }
        return null;
    }

    private CoursesWithModule getCourseById(int courseId) throws ExecutionException, InterruptedException {
        HttpHeaders headers = new HttpHeaders();
        headers.add("Authorization", AccessToken.getAccessToken());

        HttpEntity entity = new HttpEntity<>(headers);
        CommonHystrixCommand<CoursesWithModule> courseByIdHystrixCommand =
                new CommonHystrixCommand<CoursesWithModule>("default", () ->
                {
                    String uri = "http://localhost:8080/api/courses/" + courseId;
                    return restTemplate
                            .exchange(uri,HttpMethod.GET,entity, CoursesWithModule.class)
                            .getBody();
                }, () ->
                {
                    System.out.println("not");
                    return new CoursesWithModule();
                });
        Future<CoursesWithModule> courseFuture = courseByIdHystrixCommand.queue();
        return courseFuture.get();
    }

    @Override
    public List<AttendanceWithCourse> getAttendanceByStudentName(String studentName)
            throws ExecutionException, InterruptedException {
        //fetching all the attendance by studentName
        List<Attendance> byIdStudentName = repository.findByAttendanceIdStudentName(studentName);
        if (!(byIdStudentName.isEmpty())) {
            //filtering all distinct courseId
            List<Integer> distinctCourseIdList = byIdStudentName.stream()
                    .map(attendance -> attendance.getAttendanceId().getCourseId())
                    .distinct()
                    .collect(Collectors.toList());
            System.out.println(distinctCourseIdList);

            //fetching all related courses
            Course[] courseByIdList = getCourseByIdList(distinctCourseIdList);

            System.out.println(courseByIdList.length);

            return byIdStudentName.stream()
                    .map(attendance -> {
                        return new AttendanceWithCourse(attendance,
                                new CoursesWithModule(courseBiFunction
                                        .apply(attendance.getAttendanceId().getCourseId()
                                                , courseByIdList), null));
                    }).collect(Collectors.toList());
        }
        return null;
    }

    BiFunction<Integer, Course[], Course> courseBiFunction = (id, list) ->
            Arrays.stream(list).filter(c -> c.getId() == id).findFirst().orElse(null);


    private Course[] getCourseByIdList(List<Integer> distinctCourseIdList)
            throws ExecutionException, InterruptedException {
        HttpHeaders headers = new HttpHeaders();
        headers.add("Authorization", AccessToken.getAccessToken());

        HttpEntity entity = new HttpEntity<>(distinctCourseIdList,headers);

        CommonHystrixCommand<Course[]> courseByIdHystrixCommand =
                new CommonHystrixCommand<Course[]>("default", () ->
                {
                    String uri = "http://localhost:8080/api/courses/?isAttendance=true";
                    return restTemplate
                            .exchange(uri,HttpMethod.POST,entity, Course[].class)
                            .getBody();
                }, () ->
                {
                    System.out.println("inthis");
                    return new Course[0];
                });
        Future<Course[]> courseFuture = courseByIdHystrixCommand.queue();
        return courseFuture.get();
    }

    @Override
    public CourseWithAttendanceList getAttendanceByCourseId(int courseId)
            throws ExecutionException, InterruptedException {
        //fetch attendance by course id
        List<Attendance> byIdCourseId = repository.findByAttendanceIdCourseId(courseId);

        if (!(byIdCourseId.isEmpty())) {
            //get coures by course id
            CoursesWithModule courseById = getCourseById(courseId);

            return new CourseWithAttendanceList(courseById, byIdCourseId);
        }
        return null;
    }
}

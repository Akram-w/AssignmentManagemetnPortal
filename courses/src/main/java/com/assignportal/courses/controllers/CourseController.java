package com.assignportal.courses.controllers;

import com.assignportal.courses.servicer.CourseService;
import model.courses.Course;
import model.responseModels.CoursesWithModule;
import model.responseModels.SubscriptionsWithCourses;
import model.subscription.Subscription;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.concurrent.ExecutionException;

@RestController
public class CourseController {

    @Autowired
    CourseService courseService;


    /*
        Endpoint to save course
        @RequestBody Course
     */
    @PostMapping(value = "/courses")
    public Course saveCourse(@RequestBody Course course) {
        return courseService.save(course);
    }

    /*
        Endpoint to update course
        @PathVariable courseId
        @RequestBody Course
     */
    @PutMapping(value = "/courses/{id}")
    public ResponseEntity<Course> updateCourse(@RequestBody Course course, @PathVariable int id) {
        Course updatedCourse = courseService.update(course, id);
        return ResponseEntity.ok().body(updatedCourse);
    }

    /*
        Endpoint to update course status
        @PathVariable courseId
        @RequestParam boolean status
     */
    @PutMapping(value = "/courses/{id}", params = "status")
    public ResponseEntity<Course> updateCourseStatus(@PathVariable int id,
                                             @RequestParam(value = "status") boolean status)
            throws ExecutionException, InterruptedException {

        Course courseById = courseService.deActivateCourse(id, status);
        if (courseById == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new Course());
        } else {
            return ResponseEntity.status(HttpStatus.OK).body(courseById);
        }
    }

    /*
        Endpoint to delete course
        @PathVariable courseId
     */
    @DeleteMapping(value = "/courses/{id}")
    public ResponseEntity<String> deleteCourse(@PathVariable int id)
            throws ExecutionException, InterruptedException {

        try {
            courseService.delete(id);
            return ResponseEntity.status(HttpStatus.OK).body("Course has deleted");
        } catch (EmptyResultDataAccessException erda) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Couldn't find given course");
        }

    }

    /*
        Endpoint to get All courses
     */
    @GetMapping(value = "/courses")
    public List<Course> getAllCourses() {
        return courseService.getAllCourses();
    }

    /*
        Endpoint to get All  courses related to subscription list
        @RequestParam boolean isSubscriptionList
        @RequestBody List<Subscription>
     */
    @PostMapping(value = "/courses", params = "isSubscriptionList")
    public List<SubscriptionsWithCourses> getAllCoursesBySubscriptionList(
            @RequestBody List<Subscription> subscriptionList,
            @RequestParam(value = "isSubscriptionList") boolean status)
            throws ExecutionException, InterruptedException {

        if (status) {
            return courseService.getAllCoursesBySubscriptionList(subscriptionList);
        }
        return new ArrayList<>();
    }

    /*
       Endpoint to get All  courses by list of id
       @RequestParam boolean isSubscriptionList
       @RequestBody List<Subscription>
    */
    @PostMapping(value = "/courses", params = "isAttendance")
    public List<Course> getAllCoursesByIdList(
            @RequestBody Integer[] subscriptionList,
            @RequestParam(value = "isAttendance") boolean status)
            throws ExecutionException, InterruptedException {

        if (status) {
            System.out.println(subscriptionList);
            List< Course> list = courseService.getAllCoursesByIdList(Arrays.asList(subscriptionList));

           list.stream().forEach((k)-> System.out.println(k));

            return list;
        }
        return new ArrayList<>();
    }


    /*
        Endpoint to get course by id
        @PathVariable courseId
     */
    @GetMapping(value = "/courses/{id}")
    public ResponseEntity<CoursesWithModule> getCourseById(@PathVariable int id)
            throws ExecutionException, InterruptedException {
        CoursesWithModule courseById = courseService.getCourseById(id);
        if (courseById == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new CoursesWithModule());
        } else {
            return ResponseEntity.status(HttpStatus.OK).body(courseById);
        }
    }

    /*
        Endpoint to check whether course is active
        @PathVariable courseId
     */
    @GetMapping(value = "/courses/{id}/isActive")
    public String checkCourseIsActive(@PathVariable int id)
            throws ExecutionException, InterruptedException {

        Course courseActive = courseService.isCourseActive(id);
        System.out.println(courseActive + ": checking active ");
        if (courseActive == null) {
            return "NOT-FOUND";
        }
        System.out.println(courseActive.isActive());
        return courseActive.isActive() ? "ACTIVE" : "NOT-ACTIVE";
    }

    /*
        Endpoint to get all courses by tutor name
        @RequestParam tutorName
     */
    @GetMapping(value = "/courses", params = "tutorName")
    public List<Course> findAllCourseByTutorName(@RequestParam(value = "tutorName") String tutorName) {
        List<Course> allCoursesByTutor = courseService.getAllCoursesByTutor(tutorName);
        return allCoursesByTutor;
    }
}

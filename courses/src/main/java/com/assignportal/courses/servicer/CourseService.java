package com.assignportal.courses.servicer;

import model.courses.Course;
import model.responseModels.CoursesWithModule;
import model.responseModels.SubscriptionsWithCourses;
import model.subscription.Subscription;

import java.util.List;
import java.util.concurrent.ExecutionException;

public interface CourseService {
    Course save(Course course);
    Course update(Course course,int id);
    void delete(int id) throws ExecutionException, InterruptedException;
    List<Course> getAllCourses();
    CoursesWithModule getCourseById(int id) throws ExecutionException, InterruptedException;
    Course deActivateCourse(int id,boolean status) throws ExecutionException, InterruptedException;
    Course isCourseActive(int id) throws ExecutionException, InterruptedException;
    List<Course> getAllCoursesByTutor(String tutorName);
    List<SubscriptionsWithCourses> getAllCoursesBySubscriptionList(List<Subscription> subscriptionList) throws ExecutionException, InterruptedException;

    List<Course> getAllCoursesByIdList(List<Integer> subscriptionList);
}

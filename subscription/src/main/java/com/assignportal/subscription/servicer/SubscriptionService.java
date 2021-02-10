package com.assignportal.subscription.servicer;

import model.exception.AlreadyRegisteredToCourse;
import model.exception.CourseNotActive;
import model.exception.CourseNotExists;
import model.responseModels.CourseWithSubscriptionList;
import model.responseModels.SubscriptionsWithCourses;
import model.subscription.Subscription;

import java.util.List;
import java.util.concurrent.ExecutionException;


public interface SubscriptionService {

    Subscription save(Subscription subscription,String type)
            throws ExecutionException, InterruptedException;
    Subscription update(Subscription subscription,int id)
            throws ExecutionException, InterruptedException;
    List<Subscription> getAllSubscriptions();
    SubscriptionsWithCourses getSubscriptionById(int id)
            throws ExecutionException, InterruptedException;
    void delete(int id);
    List<SubscriptionsWithCourses> getAllSubscriptionsByStudentName(String name)
            throws ExecutionException, InterruptedException;
    List<Integer> getSubscriptionByStudentName(String studentName);
    CourseWithSubscriptionList getAllSubscriptionsByCourseId(int courseId)
            throws ExecutionException, InterruptedException;
    Subscription setAcceptedStatus(int id, boolean status)
            throws  ExecutionException, InterruptedException;
    Subscription setBannedStatus(int id, boolean status)
            throws ExecutionException, InterruptedException;
    Subscription isSubscriptionAccepted(int id);
    List<SubscriptionsWithCourses> getAllSubscriptionsByCourseIdAndAccepted(int id, boolean status)
            throws ExecutionException, InterruptedException;
    List<SubscriptionsWithCourses> getSubscriptionsByCourseIdAndBannedStatus(int id, boolean status)
            throws ExecutionException, InterruptedException;
}

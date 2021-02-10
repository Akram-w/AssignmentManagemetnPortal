package com.assignportal.subscription.repository;

import model.subscription.Subscription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface SubscriptionRepository extends JpaRepository<Subscription, Integer> {

    List<Subscription> findByStudentName(String name);
    List<Subscription> findByCourseIdAndAccepted(@Param("courseId") int Id,@Param("accepted") boolean status);
    @Query(value = "SELECT sub FROM Subscription sub WHERE sub.banned=?1 AND sub.courseId=?2")
    List<Subscription> findByBannedAndCourseId(@Param("banned") boolean status,@Param("courseId") int id);
    List<Subscription> findByCourseId(int courseId);
    Optional<Subscription> findByStudentNameAndCourseId(String name, int courseId);
}

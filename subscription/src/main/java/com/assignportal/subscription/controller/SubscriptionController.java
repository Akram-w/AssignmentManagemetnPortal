package com.assignportal.subscription.controller;

import com.assignportal.subscription.servicer.SubscriptionService;
import model.responseModels.CourseWithSubscriptionList;
import model.responseModels.SubscriptionsWithCourses;
import model.subscription.Subscription;
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
public class SubscriptionController {

    @Autowired
    SubscriptionService subscriptionService;

    /*
        Endpoint to save subscriptions
        @RequestBody Subscription
     */
    @PostMapping(value = "/subscriptions")
    @PreAuthorize("hasAuthority('create_subscription')")
    public Subscription saveSubscription(@RequestBody Subscription subscription)
            throws ExecutionException, InterruptedException {


        subscription.setBanned(false);
        Subscription save = subscriptionService.save(subscription, "save");

        return (save == null) ? new Subscription() : save;
    }

    /*
        Endpoint to update subscriptions
        @PathVariable subscriptionId
        @RequestBody Subscription
     */
    @PutMapping(value = "/subscriptions/{id}")
    @PreAuthorize("hasAuthority('update_subscription')")
    public ResponseEntity<Subscription> updateSubscription(@RequestBody Subscription subscription,
                                                           @PathVariable int id)
            throws ExecutionException, InterruptedException {

        Subscription updatedSubscription = subscriptionService.update(subscription, id);

        return updatedSubscription == null ?
                ResponseEntity.status(HttpStatus.NOT_FOUND).body(new Subscription()) :
                ResponseEntity.ok().body(updatedSubscription);
    }

    /*
       Endpoint to update Accepted status in Subscription
       @PathVariable subscriptionId
       @RequestParam boolean as Accepted status
    */
    @PutMapping(value = "/subscriptions/{id}", params = "accepted")
    @PreAuthorize("hasAuthority('update_subscription')")
    public ResponseEntity updateAcceptedStatus(@PathVariable int id,
                                               @RequestParam(value = "accepted") boolean status)
            throws ExecutionException, InterruptedException {

        Subscription subscriptionById = subscriptionService.setAcceptedStatus(id, status);
        if (subscriptionById == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Couldn't find given Subscription");
        } else {
            return ResponseEntity.status(HttpStatus.OK).body(subscriptionById);
        }
    }

    /*
          Endpoint to update Banned status in Subscription
          @PathVariable subscriptionId
          @RequestParam boolean as Banned status
    */
    @PutMapping(value = "/subscriptions/{id}", params = "banned")
    @PreAuthorize("hasAuthority('update_subscription')")
    public ResponseEntity<Subscription> updateBannedStatus(@PathVariable int id,
                                                           @RequestParam(value = "banned") boolean status)
            throws ExecutionException, InterruptedException {
        Subscription subscriptionById = subscriptionService.setBannedStatus(id, status);
        if (subscriptionById == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new Subscription());
        } else {
            return ResponseEntity.status(HttpStatus.OK).body(subscriptionById);
        }
    }

    /*
        Endpoint to Delete subscriptions
        @PathVariable subscriptionId
     */
    @DeleteMapping(value = "/subscriptions/{id}")
    @PreAuthorize("hasAuthority('delete_subscription')")
    public ResponseEntity deleteSubscription(@PathVariable int id) {
        try {
            subscriptionService.delete(id);
            return ResponseEntity.status(HttpStatus.OK).body("Subscription has deleted");
        } catch (EmptyResultDataAccessException erda) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Couldn't find given Subscription");
        }
    }

    /*
        Endpoint to get All subscriptions
     */
    @GetMapping(value = "/subscriptions")
    @PreAuthorize("hasAuthority('read_subscription')")
    public List<Subscription> getAllSubscription() {
        return subscriptionService.getAllSubscriptions();
    }

    /*
        Endpoint to get subscription by id
        @PathVariable subscriptionId
     */
    @GetMapping(value = "/subscriptions/{id}")
    @PreAuthorize("hasAuthority('read_subscription')")
    public ResponseEntity<SubscriptionsWithCourses> getSubscriptionById(@PathVariable int id)
            throws ExecutionException, InterruptedException {
        SubscriptionsWithCourses moduleById = subscriptionService.getSubscriptionById(id);
        if (moduleById == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new SubscriptionsWithCourses());
        } else {
            return ResponseEntity.status(HttpStatus.OK).body(moduleById);
        }
    }

    /*
        Endpoint to get subscription by studentName
        @RequestParam studentName
     */
    @GetMapping(value = "/subscriptions", params = "studentName")
    @PreAuthorize("hasAuthority('read_subscription')")
    public List<SubscriptionsWithCourses> getAllSubscriptionsByStudentName(
            @RequestParam(value = "studentName") String name)
            throws ExecutionException, InterruptedException {

        List<SubscriptionsWithCourses> list = subscriptionService.getAllSubscriptionsByStudentName(name);
        System.out.println(list);
        return list;
    }

    /*
        Endpoint to get subscription by studentName and accepted status
        @RequestParam studentName
     */
    @GetMapping(value = "/subscriptions", params = {"courseId", "accepted"})
    @PreAuthorize("hasAuthority('read_subscription')")
    public List<SubscriptionsWithCourses> getAllSubscriptionsByCourseAndStatus(
            @RequestParam(value = "courseId") int id, @RequestParam(value = "accepted") boolean status)
            throws ExecutionException, InterruptedException {

        return subscriptionService.getAllSubscriptionsByCourseIdAndAccepted(id, status);
    }

    /*
        Endpoint to get subscription by studentName and banned status
        @RequestParam studentName
     */
    @GetMapping(value = "/subscriptions", params = {"courseId", "banned"})
    @PreAuthorize("hasAuthority('read_subscription')")
    public List<SubscriptionsWithCourses> getSubscriptionsByCourseIdAndBannedStatus(
            @RequestParam(value = "courseId") int id, @RequestParam(value = "banned") boolean status)
            throws ExecutionException, InterruptedException {

        return subscriptionService.getSubscriptionsByCourseIdAndBannedStatus(id, status);
    }

    /*
        Endpoint to get subscribed courseId by studentName
        @RequestParam studentName
        @RequestParam boolean isCourseId
     */
    @GetMapping(value = "/subscriptions", params = {"studentName", "isCourseId"})
    @PreAuthorize("hasAuthority('read_subscription')")
    public List<Integer> getCourseIdByStudentName(@RequestParam(value = "studentName") String name,
                                                  @RequestParam("isCourseId") boolean courseId) {

        return courseId ? subscriptionService.getSubscriptionByStudentName(name)
                : new ArrayList<Integer>();
    }

    /*
        Endpoint to get subscription by courseId
        @RequestParam courseId
     */
    @GetMapping(value = "/subscriptions", params = "courseId")
    @PreAuthorize("hasAuthority('read_subscription')")
    public CourseWithSubscriptionList getAllSubscriptionsByCourseId(@RequestParam(value = "courseId") int id)
            throws ExecutionException, InterruptedException {
        CourseWithSubscriptionList list = subscriptionService.getAllSubscriptionsByCourseId(id);
        System.out.println(list);
        return list;
    }

    /*
        Endpoint to check Subscription IsAccepted
        @PathVariable subscriptionId
     */
    @GetMapping(value = "/subscriptions/{id}/isAccepted")
    @PreAuthorize("hasAuthority('read_subscription')")
    public String checkSubscriptionAccepted(@PathVariable int id) {
        Subscription moduleActive = subscriptionService.isSubscriptionAccepted(id);
        if (moduleActive == null) {
            return "NOT_FOUND";
        }
        return moduleActive.isAccepted() ? "ACCEPTED" : "NOT-ACCEPTED";
    }

    /*
        Endpoint to check Subscription IsBanned
        @PathVariable subscriptionId
     */
    @GetMapping(value = "/subscriptions/{id}/isBanned")
    @PreAuthorize("hasAuthority('read_subscription')")
    public String checkSubscriptionBanned(@PathVariable int id) {
        Subscription moduleActive = subscriptionService.isSubscriptionAccepted(id);
        if (moduleActive == null) {
            return "NOT_FOUND";
        }
        return moduleActive.isBanned() ? "BANNED" : "NOT-BANNED";
    }

    //create end point to get all subscribed user list by course id
}

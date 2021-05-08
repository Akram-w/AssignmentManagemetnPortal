package com.assignportal.subscription.servicer;

import com.assignportal.subscription.config.AccessToken;
import com.assignportal.subscription.repository.SubscriptionRepository;
import model.exception.AlreadyRegisteredToCourse;
import model.exception.CourseNotActive;
import model.exception.CourseNotExists;
import model.hystix.CommonHystrixCommand;
import model.responseModels.CourseWithSubscriptionList;
import model.responseModels.CoursesWithModule;
import model.responseModels.SubscriptionsWithCourses;
import model.subscription.Subscription;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.Future;
import java.util.stream.Collectors;

@Service
public class SubscriptionServiceImpl implements SubscriptionService {

    @Autowired
    SubscriptionRepository subscriptionRepository;
    @Autowired
    RestTemplate restTemplate;

    @Override
    public Subscription save(Subscription subscription, String type)
            throws ExecutionException, InterruptedException {

        String courseStatus = isActiveCourse(subscription.getCourseId());
        System.out.println(courseStatus);
        if (courseStatus.equals("ACTIVE")) {
            if (type.equals("update")) {
                return subscriptionRepository.save(subscription);
            }
            Optional<Subscription> byStudentNameAndCourseId = subscriptionRepository.
                    findByStudentNameAndCourseId(subscription.getStudentName(), subscription.getCourseId());
            if (byStudentNameAndCourseId.isPresent()) {
                throw new AlreadyRegisteredToCourse(
                        subscription.getStudentName() + " already registered to given course");
            }
            return subscriptionRepository.save(subscription);
        } else if (courseStatus.equals("NOT-ACTIVE")) {
            throw new CourseNotActive("Course under id : " + subscription.getCourseId() + " not active");
        } else if (courseStatus.equals("NOT-FOUND")) {
            throw new CourseNotExists("Course under id: " + subscription.getCourseId() + " not Found");
        }
        return null;
    }

    private String isActiveCourse(int courseId) throws ExecutionException, InterruptedException {
        HttpHeaders headers=new HttpHeaders();
        headers.add("Authorization", AccessToken.getAccessToken());

        HttpEntity entity=new HttpEntity(headers);

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
    public Subscription update(Subscription subscription, int id)
            throws ExecutionException, InterruptedException {
        subscription.setId(id);
        if (subscriptionRepository.existsById(id)) {
            return save(subscription, "update");
        }
        return null;
    }

    @Override
    public List<Subscription> getAllSubscriptions() {
        return subscriptionRepository.findAll();
    }

    @Override
    public SubscriptionsWithCourses getSubscriptionById(int id)
            throws ExecutionException, InterruptedException {
        Optional<Subscription> byId = subscriptionRepository.findById(id);

        if (byId.isPresent()) {
            Subscription subscriptionById = byId.get();
            CoursesWithModule courseById = getCourseById(subscriptionById.getCourseId());
            CoursesWithModule coursesWithModule = null;

            return new SubscriptionsWithCourses(courseById, subscriptionById);
        }
        return null;
    }

    @Override
    public void delete(int id) {
        subscriptionRepository.deleteById(id);
    }

    @Override
    public List<SubscriptionsWithCourses> getAllSubscriptionsByStudentName(String name)
            throws ExecutionException, InterruptedException {
        List<Subscription> byStudentName = subscriptionRepository.findByStudentName(name);

        return getCourseByListOfId(byStudentName);
    }

    @Override
    public List<SubscriptionsWithCourses> getAllSubscriptionsByCourseIdAndAccepted
            (int id, boolean status) throws ExecutionException, InterruptedException {
        List<Subscription> nameAcceptedTrue =
                subscriptionRepository.findByCourseIdAndAccepted(id, status);

        return getCourseByListOfId(nameAcceptedTrue);
    }

    @Override
    public List<SubscriptionsWithCourses> getSubscriptionsByCourseIdAndBannedStatus
            (int id, boolean status) throws ExecutionException, InterruptedException {
        List<Subscription> bannedTrue =
                subscriptionRepository.findByBannedAndCourseId(status, id);

        return getCourseByListOfId(bannedTrue);
    }

    @Override
    public CourseWithSubscriptionList getAllSubscriptionsByCourseId(int courseId)
            throws ExecutionException, InterruptedException {
        List<Subscription> byCourseId = subscriptionRepository.findByCourseId(courseId);
        CoursesWithModule courseById = getCourseById(courseId);

        return new CourseWithSubscriptionList(courseById, byCourseId);
    }

    private List<SubscriptionsWithCourses> getCourseByListOfId(List<Subscription> courseId)
            throws ExecutionException, InterruptedException {
        HttpHeaders headers=new HttpHeaders();
        headers.add("Authorization", AccessToken.getAccessToken());
        headers.add("Content-Type","application/json");

        HttpEntity entity=new HttpEntity(courseId,headers);

        CommonHystrixCommand<SubscriptionsWithCourses[]> courseListHystrixCommand =
                new CommonHystrixCommand<SubscriptionsWithCourses[]>
                        ("default", () ->
                        {
                            String uri = "http://localhost:8080/api/courses/?isSubscriptionList=true";
                            return restTemplate.exchange(uri, HttpMethod.POST, entity,
                                    SubscriptionsWithCourses[].class).getBody();

                        }, () ->
                        {
                            System.out.println("error");
                            return courseId
                                    .stream()
                                    .map(subscription -> new SubscriptionsWithCourses
                                            (null, subscription))
                                    .toArray((size)-> new SubscriptionsWithCourses[size]);
                        });

        Future<SubscriptionsWithCourses[]> courseListFuture = courseListHystrixCommand.queue();
        return Arrays.asList(courseListFuture.get());
    }

    private CoursesWithModule getCourseById(int courseId) throws ExecutionException, InterruptedException {
        HttpHeaders headers=new HttpHeaders();
        headers.add("Authorization", AccessToken.getAccessToken());

        HttpEntity entity=new HttpEntity(courseId,headers);

        CommonHystrixCommand<CoursesWithModule> courseHystrixCommand =
                new CommonHystrixCommand<CoursesWithModule>("default", () ->
                {
                    String uri = "http://localhost:8080/api/courses/" + courseId;
                    return restTemplate
                            .exchange(uri,HttpMethod.GET,entity, CoursesWithModule.class)
                            .getBody();
                }, () -> {
                    return new CoursesWithModule();
                });
        Future<CoursesWithModule> courseFuture = courseHystrixCommand.queue();
        return courseFuture.get();
    }

    @Override
    public Subscription setAcceptedStatus(int id, boolean status)
            throws ExecutionException, InterruptedException {
        Optional<Subscription> byId = subscriptionRepository.findById(id);
        if (byId.isPresent()) {
            Subscription subscription = byId.get();
            subscription.setAccepted(status);
            return update(subscription, id);
        }
        return null;
    }

    @Override
    public Subscription setBannedStatus(int id, boolean status)
            throws AlreadyRegisteredToCourse, ExecutionException, InterruptedException {
        Optional<Subscription> byId = subscriptionRepository.findById(id);
        if (byId.isPresent()) {
            Subscription subscription = byId.get();
            subscription.setBanned(status);
            return update(subscription, id);
        }
        return null;
    }

    @Override
    public Subscription isSubscriptionAccepted(int id) {
        Optional<Subscription> byId = subscriptionRepository.findById(id);
        if (byId.isPresent()) {
            return byId.get();
        }
        return null;
    }

    @Override
    public List<Integer> getSubscriptionByStudentName(String studentName) {
        return subscriptionRepository.findByStudentName(studentName)
                .stream()
                .map(subscription -> subscription.getCourseId())
                .collect(Collectors.toList());
    }
}

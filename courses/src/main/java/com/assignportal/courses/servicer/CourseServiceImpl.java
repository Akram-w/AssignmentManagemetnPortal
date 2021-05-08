package com.assignportal.courses.servicer;

import com.assignportal.courses.repository.CourseRepository;
import config.AccessToken;
import model.courses.Course;
import model.exception.CourseAlreadyExists;
import model.hystix.CommonHystrixCommand;
import model.modules.Module;
import model.responseModels.CoursesWithModule;
import model.responseModels.SubscriptionsWithCourses;
import model.subscription.Subscription;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.Future;

@Service
public class CourseServiceImpl implements CourseService {

    @Autowired
    CourseRepository courseRepository;

    @Autowired
    RestTemplate restTemplate;

    @Override
    public Course save(Course course) {
        Optional<Course> name = courseRepository.findByTutorNameAndCourseName(course.getTutorName(), course.getCourseName());
        if(name.isPresent()){
            throw new CourseAlreadyExists("Course has Already under this tutor");
        }
        return courseRepository.save(course);
    }

    @Override
    public Course update(Course course, int id) {
        course.setId(id);
        Course savedCourse = courseRepository.save(course);
        return savedCourse;
    }

    @Override
    public Course deActivateCourse(int id, boolean status) throws ExecutionException, InterruptedException {
        CoursesWithModule courseById = getCourseById(id);
        if (courseById != null) {
            Course course = courseById.getCourse();
            course.setActive(status);
            return update(course, id);
        }
        return null;
    }

    @Override
    public void delete(int id) throws ExecutionException, InterruptedException {
        deleteAllSubjectsUnderCourse(id);
        courseRepository.deleteById(id);
    }

    private String deleteAllSubjectsUnderCourse(int id) throws ExecutionException, InterruptedException {
        //delete all the subject under
        HttpHeaders headers=new HttpHeaders();
        headers.add("Authorization", AccessToken.getAccessToken());

        HttpEntity entity=new HttpEntity(headers);

        CommonHystrixCommand<String> deleteSubjectHystrixCommand = new CommonHystrixCommand<String>
                ("default", () ->
                {

                    String uri = "http://localhost:8080/api/modules/course/" + id;
                    restTemplate.exchange(uri, HttpMethod.DELETE,entity,String.class);
                    return "done";
                }, () -> {
                    return null;
                });
        Future<String> deleteSubjectFuture = deleteSubjectHystrixCommand.queue();
        return deleteSubjectFuture.get();
    }

    @Override
    public List<Course> getAllCourses() {
        return courseRepository.findAll();
    }

    @Override
    public CoursesWithModule getCourseById(int id) throws ExecutionException, InterruptedException {
        Optional<Course> byId = courseRepository.findById(id);
        if (byId.isPresent()) {
            List<Module> allModulesUnderCourse = getAllModulesUnderCourse(id);
            return new CoursesWithModule(byId.get(), allModulesUnderCourse);
        }
        return null;
    }

    private List<Module> getAllModulesUnderCourse(int id)
            throws ExecutionException, InterruptedException {
        HttpHeaders headers=new HttpHeaders();
        headers.add("Authorization",AccessToken.getAccessToken());
        System.out.println(AccessToken.getAccessToken());

        CommonHystrixCommand<List<Module>> moduleListCommand = new CommonHystrixCommand<List<Module>>
                ("default",
                        () -> {

                    HttpEntity entity=new HttpEntity(headers);
                            String uri = "http://localhost:8080/api/modules?courseId=" + id;
                            return restTemplate
                                    .exchange(uri,HttpMethod.GET,entity, List.class)
                                    .getBody();

                        }, () -> {
                    System.out.println("error");
                    return new ArrayList<Module>();
                });

        Future<List<Module>> moduleListFuture = moduleListCommand.queue();
        return moduleListFuture.get();
    }

    @Override
    public Course isCourseActive(int id) throws ExecutionException, InterruptedException {
        CoursesWithModule course = getCourseById(id);
        if (course != null) {
            return course.getCourse();
        }
        return null;
    }

    @Override
    public List<Course> getAllCoursesByTutor(String tutorName) {
        System.out.println(tutorName);
        return courseRepository.findByTutorName(tutorName);
    }

    @Override
    public List<SubscriptionsWithCourses> getAllCoursesBySubscriptionList
            (List<Subscription> subscriptionList) throws ExecutionException, InterruptedException {

        List<SubscriptionsWithCourses> collect = new ArrayList<>();

        for (Subscription subscription : subscriptionList) {
            Optional<Course> id = courseRepository.findById(subscription.getCourseId());
            CoursesWithModule byId;
            if(id.isPresent()){
                byId =new CoursesWithModule(id.get(), null);
            }else {
                byId = new CoursesWithModule(null, null);
            }

            SubscriptionsWithCourses subscriptionsWithCourses =
                    new SubscriptionsWithCourses(byId, subscription);
            collect.add(subscriptionsWithCourses);
        }
        System.out.println(collect);
        return collect;
    }

    @Override
    public List<Course> getAllCoursesByIdList(List<Integer> subscriptionList) {
        List<Course> byIdIn = courseRepository.findByIdIn(subscriptionList);

        byIdIn.stream().forEach(System.out::println);

        return byIdIn;
    }

    @Override
    public List<Course> getAllActiveCoursesByTutor(String name, boolean status) {
        List<Course> all = courseRepository.findAll();

        List<Course> temp= new ArrayList<>();
        for (Course course:all){
            if(status){
                if(course.isActive()){
                    temp.add(course);
                }
            }else{
                if(!(course.isActive())){
                    temp.add(course);
                }
            }
        }
        return temp;
    }
}

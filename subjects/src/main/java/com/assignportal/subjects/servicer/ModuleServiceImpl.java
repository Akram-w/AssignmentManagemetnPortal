package com.assignportal.subjects.servicer;

import com.assignportal.subjects.config.AccessToken;
import com.assignportal.subjects.repository.ModuleRepository;
import model.exception.CourseNotActive;
import model.exception.CourseNotExists;
import model.hystix.CommonHystrixCommand;
import model.modules.Module;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Optional;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.Future;

@Service
public class ModuleServiceImpl implements ModuleService {

    @Autowired
    ModuleRepository moduleRepository;

    @Autowired
    RestTemplate restTemplate;

    @Override
    public Module save(Module module) throws ExecutionException, InterruptedException {
        String courseStatus = isActiveCourse(module.getCourseId());
        if (courseStatus.equals("ACTIVE")) {
            return moduleRepository.save(module);
        } else if (courseStatus.equals("NOT-ACTIVE")) {
            throw new CourseNotActive("Course under id : " + module.getCourseId() + " not active");
        } else if (courseStatus.equals("NOT-FOUND")) {
            throw new CourseNotExists("Course under id: " + module.getCourseId() + " not Found");
        }
        return null;
    }

    @Override
    public Module update(Module module, int id) throws ExecutionException, InterruptedException {
        module.setId(id);
        return save(module);
    }

    private String isActiveCourse(int courseId) throws ExecutionException, InterruptedException {

        HttpHeaders headers=new HttpHeaders();
        headers.add("Authorization", AccessToken.getAccessToken());

        HttpEntity entity=new HttpEntity(headers);
        CommonHystrixCommand<String> statusHystrixCommand = new CommonHystrixCommand<String>
                ("default", () ->
                {


                    String uri = "http://localhost:8080/courses/" + courseId + "/isActive";
                    return restTemplate
                            .exchange(uri, HttpMethod.GET,entity, String.class)
                            .getBody();
                }, () ->
                {
                    return "NOT-FOUND";
                });
        Future<String> statusFuture = statusHystrixCommand.queue();
        return statusFuture.get();
    }

    @Override
    public void delete(int id) {
        deleteAllAssessmentsUnderModule(id);
        moduleRepository.deleteById(id);
    }

    private void deleteAllAssessmentsUnderModule(int id) {
        //delete all the assessment by given module id

    }

    @Override
    public void deleteByCourseId(int courseId) {
        moduleRepository.deleteByCourseId(courseId);
    }

    @Override
    public List<Module> getAllModules() {
        return moduleRepository.findAll();
    }

    @Override
    public Module getModuleById(int id) {
        Optional<Module> moduleById = moduleRepository.findById(id);
        if (moduleById.isPresent()) {
            return moduleById.get();
        }
        return null;
    }

    @Override
    public Module deActivateModule(int id, boolean status)
            throws ExecutionException, InterruptedException {
        Module moduleById = getModuleById(id);
        if (moduleById != null) {
            moduleById.setActive(status);
            return update(moduleById, id);
        }
        return null;
    }

    @Override
    public Module isModuleActive(int id) {
        return getModuleById(id);
    }

    @Override
    public List<Module> getAllModulesByCourseId(int courseId) {
        return moduleRepository.findByCourseId(courseId);
    }
}

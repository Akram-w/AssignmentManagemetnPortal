package com.assignportal.subjects.controller;

import com.assignportal.subjects.servicer.ModuleService;
import model.modules.Module;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.concurrent.ExecutionException;

@RestController
public class ModuleController {

    @Autowired
    ModuleService moduleService;


    /*
        Endpoint to save Module
        @RequestBody Module
     */
    @PostMapping(value = "/modules")
    @PreAuthorize("hasAuthority('create_modules')")
    public Module saveModule(@RequestBody Module module)
            throws ExecutionException, InterruptedException {

        return moduleService.save(module);
    }

    /*
        Endpoint to update Module
        @PathVariable moduleId
        @RequestBody Module
     */
    @PutMapping(value = "/modules/{id}")
    @PreAuthorize("hasAuthority('update_modules')")
    public ResponseEntity<Module> updateModule(@RequestBody Module module, @PathVariable int id)
            throws ExecutionException, InterruptedException {
        Module updatedModule = moduleService.update(module, id);
        return ResponseEntity.ok().body(updatedModule);
    }

    /*
        Endpoint to update Module status
        @PathVariable moduleId
        @RequestParam boolean status
     */
    @PutMapping(value = "/modules/{id}", params = "status")
    @PreAuthorize("hasAuthority('update_modules')")
    public ResponseEntity<Module> updateModuleStatus(@PathVariable int id,
                                             @RequestParam(value = "status") boolean status)
            throws ExecutionException, InterruptedException {

        Module moduleById = moduleById = moduleService.deActivateModule(id, status);

        if (moduleById == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new Module());
        } else {
            return ResponseEntity.status(HttpStatus.OK).body(moduleById);
        }
    }

    /*
        Endpoint to delete Module
        @PathVariable moduleId
     */
    @DeleteMapping(value = "/modules/{id}")
    @PreAuthorize("hasAuthority('delete_modules')")
    public ResponseEntity<String> deleteModule(@PathVariable int id) {
        try {
            moduleService.delete(id);
            return ResponseEntity.status(HttpStatus.OK).body("Course has deleted");
        } catch (EmptyResultDataAccessException erda) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Couldn't find given Module");
        }
    }

    /*
        Endpoint to delete Modules by course courseId
        @PathVariable courseId
     */
    @DeleteMapping(value = "/modules/course/{courseId}")
    @PreAuthorize("hasAuthority('delete_modules')")
    public ResponseEntity<String> deleteModuleByCourse(@PathVariable int courseId) {
        try {
            moduleService.deleteByCourseId(courseId);
            return ResponseEntity.status(HttpStatus.OK).body("Modules are deleted under given courseId");
        } catch (EmptyResultDataAccessException erda) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Couldn't find Module from given courseId");
        }
    }

    /*
        Endpoint to get all Module
     */
    @GetMapping(value = "/modules")
    @PreAuthorize("hasAuthority('read_modules')")
    public List<Module> getAllModules() {
        return moduleService.getAllModules();
    }

    /*
        Endpoint to get Modules by id
        @PathVariable moduleId
     */
    @GetMapping(value = "/modules/{id}")
    @PreAuthorize("hasAuthority('read_modules')")
    public ResponseEntity<Module> getModuleById(@PathVariable int id) {
        Module moduleById = moduleService.getModuleById(id);
        if (moduleById == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new Module());
        } else {
            return ResponseEntity.status(HttpStatus.OK).body(moduleById);
        }
    }

    /*
        Endpoint to check whether module isActive
        @PathVariable moduleId
     */
    @GetMapping(value = "/modules/{id}/isActive")
    @PreAuthorize("hasAuthority('read_modules')")
    public String checkModuleActive(@PathVariable int id) {
        Module moduleActive = moduleService.isModuleActive(id);
        if (moduleActive == null) {
            return "NOT_FOUND";
        }
        return moduleActive.isActive() ? "ACTIVE" : "NOT-ACTIVE";
    }

    /*
        Endpoint to get all Modules courseId
        @RequestParam courseId
     */
    @GetMapping(value = "/modules", params = "courseId")
    @PreAuthorize("hasAuthority('read_modules')")
    public List<Module> findAllModuleByCourseId(@RequestParam(value = "courseId") int courseId) {
        List<Module> allModulesByCourseId = moduleService.getAllModulesByCourseId(courseId);

        return allModulesByCourseId;
    }
}

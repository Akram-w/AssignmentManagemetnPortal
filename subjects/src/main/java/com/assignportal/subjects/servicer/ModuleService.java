package com.assignportal.subjects.servicer;

import model.modules.Module;

import java.util.List;
import java.util.concurrent.ExecutionException;

public interface ModuleService {
    Module save(Module course) throws ExecutionException, InterruptedException;
    Module update(Module course,int id) throws ExecutionException, InterruptedException;
    void delete(int id);
    void deleteByCourseId(int courseId);
    List<Module> getAllModules();
    Module getModuleById(int id);
    Module deActivateModule(int id,boolean status) throws ExecutionException, InterruptedException;
    Module isModuleActive(int id);
    List<Module> getAllModulesByCourseId(int courseId);
}

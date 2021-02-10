package com.assignportal.subjects.repository;

import model.modules.Module;
import org.springframework.data.jpa.repository.JpaRepository;

import javax.transaction.Transactional;
import java.util.List;

@Transactional
public interface ModuleRepository extends JpaRepository<Module,Integer> {
    List<Module> findByCourseId(int courseId);
    void deleteByCourseId(int courseId);
}

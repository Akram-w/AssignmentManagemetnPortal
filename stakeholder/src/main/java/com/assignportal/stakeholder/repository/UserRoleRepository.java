package com.assignportal.stakeholder.repository;

import model.auth.RoleUser;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRoleRepository extends JpaRepository<RoleUser,Integer> {

    RoleUser findByUserId(int userId);
}

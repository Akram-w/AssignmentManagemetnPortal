package com.assignportal.stakeholder.service;


import model.auth.RegisterUserModel;
import model.auth.User;

import java.util.List;

public interface RegisterService {

    User save(User user, String type);

    User update(int id, User user);

    RegisterUserModel getUserById(int userId);

    User updateStatus(int id, boolean status, String type);

    List<User> getUsersListByInstitute(String name, String type);

    RegisterUserModel getUserByUserName(String userName);

    User changePassword(String password, String name);
}

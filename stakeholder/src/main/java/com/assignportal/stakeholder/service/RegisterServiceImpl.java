package com.assignportal.stakeholder.service;

import com.assignportal.stakeholder.repository.UserDetailRepository;
import com.assignportal.stakeholder.repository.UserRoleRepository;
import model.auth.RegisterUserModel;
import model.auth.RoleUser;
import model.auth.User;
import model.exception.RoleMismatch;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class RegisterServiceImpl implements RegisterService {

    @Autowired
    UserDetailRepository userRepository;

    @Autowired
    UserRoleRepository userRoleRepository;

    @Override
    public User save(User user, String type) {
        int roleId = getRoleId(type);
        //user.setTypeStatus(true) means student false means tutor
        if(type.equalsIgnoreCase("student")){
            user.setTypeStatus(true);
        }
        String bcryptPassword = bcryptPassword(user.getPassword());
        user.setPassword(bcryptPassword);
        User savedUser = userRepository.save(user);
        RoleUser roleUser = new RoleUser(roleId, user.getId());
        userRoleRepository.save(roleUser);
        return savedUser;
    }

    private String bcryptPassword(String password) {
        return BCrypt.hashpw(password,BCrypt.gensalt());
    }

    @Override
    public User update(int id, User user) {
        user.setId(id);
        String bcryptPassword = bcryptPassword(user.getPassword());
        user.setPassword(bcryptPassword);
        return userRepository.save(user);
    }

    @Override
    public User updateStatus(int id, boolean status, String type) {
        Optional<User> byId = userRepository.findById(id);
        if(byId.isPresent()){
            User user = byId.get();
            switch (type){
                case "accountNonExpired":
                    user.setAccountNonExpired(status);
                    break;
                case "credentialNonExpired":
                    user.setCredentialsNonExpired(status);
                    break;
                case "accountNonLocked":
                    user.setAccountNonLocked(status);
                    break;
            }
            return update(id,user);
        }
        return null;
    }

    @Override
    public RegisterUserModel getUserById(int userId) {
        Optional<User> byId = userRepository.findById(userId);
        if(byId.isPresent()){
            RoleUser byUserId = userRoleRepository.findByUserId(userId);

            return new RegisterUserModel(byId.get(),getRoleName(byUserId.getRoleId()));
        }
        return null;
    }

    @Override
    public List<User> getUsersListByInstitute(String name, String type) {
        List<User> byInstituteName = userRepository.findByInstituteName(name);

        List<User> temp=new ArrayList<>();

        for (User user:byInstituteName){
            if(type.equalsIgnoreCase("student")){
                if(user.isTypeStatus()){
                    temp.add(user);
                }
            }else if(type.equalsIgnoreCase("tutor")){
                if(!(user.isTypeStatus())){
                    if (user.getInstituteName()!=null) {
                        temp.add(user);
                    }
                }
            }
            throw new RoleMismatch("Couldn't find given role");
        }
        return temp;
    }

    private String getRoleName(int roleId) {
        switch (roleId) {
            case 1:
                return "institute";
            case 3:
                return "tutor";
            case 2:
                return "student";
            default:
                return null;
        }
    }

    private int getRoleId(String type) {
        switch (type) {
            case "institute":
                return 1;
            case "tutor":
                return 3;
            case "student":
                return 2;
            default:
                throw new RoleMismatch("couldn't find given user type");
        }
    }
}

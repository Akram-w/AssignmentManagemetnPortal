package com.assignportal.stakeholder.Controller;


import model.auth.User;
import com.assignportal.stakeholder.service.RegisterService;
import model.auth.RegisterUserModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController(value = "/oauth")
public class RegistrationController {

    @Autowired
    RegisterService registerService;

    @PostMapping(value = "/register")
    @PreAuthorize("permitAll()")
    public User register(@RequestBody RegisterUserModel registerUserModel){
        return registerService.save(registerUserModel.getUser(),registerUserModel.getType());
    }

    @PutMapping(value = "register/{id}")
    @PreAuthorize("hasAuthority('update_profile')")
    public User updateRegister(@PathVariable int id,@RequestBody User user){
        return registerService.update(id,user);
    }
    @PutMapping(value = "/register/{id}",params = {"status","type"})
    public ResponseEntity<User> updateStatus(@PathVariable int id,
                             @RequestParam(value = "status") boolean status,
                             @RequestParam(value = "type")String type){
        User user=registerService.updateStatus(id,status,type);
        if(user!=null){
            return ResponseEntity.status(HttpStatus.OK).body(user);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new User());
    }

    @GetMapping(value = "/register/{id}")
    @PreAuthorize("hasAuthority('read_profile')")
    public ResponseEntity<RegisterUserModel> getUser(@PathVariable int userId){
        RegisterUserModel model=registerService.getUserById(userId);

        if(model!=null){
            return ResponseEntity.status(HttpStatus.OK).body(model);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new RegisterUserModel());
    }
    @GetMapping(value = "/register",params = {"instituteName","userType"})
    @PreAuthorize("hasRole('ROLE_admin','ROLE_tutor')")
    public List<User> getUserByInstituteName(@RequestParam(value = "instituteName")String  name,
                                             @RequestParam(value = "userType") String type){
        return registerService.getUsersListByInstitute(name,type);
    }
}

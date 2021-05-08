package com.assignportal.stakeholder.Controller;


import model.auth.User;
import com.assignportal.stakeholder.service.RegisterService;
import model.auth.RegisterUserModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@RestController
public class RegistrationController extends WebSecurityConfigurerAdapter {


    @Override
    public void configure(WebSecurity web) throws Exception {
        web.ignoring().antMatchers(HttpMethod.POST).antMatchers("/register");
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.cors();
    }
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("*"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("authorization", "content-type", "x-auth-token"));
        configuration.setExposedHeaders(Arrays.asList("x-auth-token"));
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }


    @Autowired
    RegisterService registerService;

    @PostMapping(value = "register")
    public User register(@RequestBody RegisterUserModel registerUserModel){
        return registerService.save(registerUserModel.getUser(),registerUserModel.getType());
    }

    @PutMapping(value = "/register/{id}")
    @PreAuthorize("hasAuthority('update_profile')")
    public User updateRegister(@PathVariable int id,@RequestBody User user){
        return registerService.update(id,user);
    }

    @PutMapping(value = "/register/{id}",params = {"status","type"})
    @PreAuthorize("hasAuthority('update_profile')")
    public ResponseEntity<User> updateStatus(@PathVariable int id,
                             @RequestParam(value = "status") boolean status,
                             @RequestParam(value = "type")String type){
        User user=registerService.updateStatus(id,status,type);
        if(user!=null){
            return ResponseEntity.status(HttpStatus.OK).body(user);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new User());
    }
    @PutMapping(value="/register/changePassword")
    @PreAuthorize("hasRole('ROLE_student') or hasRole('ROLE_tutor')")
    public ResponseEntity changePassword(@RequestPart("body")String password,
                                         @RequestPart("name")String name){
        System.out.println(name+"-"+password);
        User user=registerService.changePassword(password,name);
        if(user!=null){
           return ResponseEntity.ok().build();
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
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
    @GetMapping(value = "/register/{userName}/UserName")
    @PreAuthorize("hasAuthority('read_profile')")
    public ResponseEntity<RegisterUserModel> getByUserName(@PathVariable String userName){
        RegisterUserModel model=registerService.getUserByUserName(userName);

        if(model!=null){
            return ResponseEntity.status(HttpStatus.OK).body(model);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new RegisterUserModel());
    }

    @GetMapping(value = "/register",params = {"instituteName","userType"})
    @PreAuthorize("hasRole('ROLE_admin') or hasRole('ROLE_tutor')")
    public List<User> getUserByInstituteName(@RequestParam(value = "instituteName")String  name,
                                             @RequestParam(value = "userType") String type){
        return registerService.getUsersListByInstitute(name,type);
    }
}

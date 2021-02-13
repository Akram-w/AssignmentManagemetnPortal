package com.assignportal.stakeholder;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.cloud.client.circuitbreaker.EnableCircuitBreaker;
import org.springframework.cloud.netflix.eureka.EnableEurekaClient;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.oauth2.config.annotation.web.configuration.EnableResourceServer;

@SpringBootApplication
@EntityScan(value = "model.auth")
@EnableEurekaClient
@EnableCircuitBreaker
@EnableResourceServer
@EnableGlobalMethodSecurity(prePostEnabled = true)
public class StakeholderApplication {

	public static void main(String[] args) {
		SpringApplication.run(StakeholderApplication.class, args);
	}

}

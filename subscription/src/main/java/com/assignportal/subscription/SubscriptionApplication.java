package com.assignportal.subscription;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.cloud.client.circuitbreaker.EnableCircuitBreaker;
import org.springframework.cloud.netflix.eureka.EnableEurekaClient;
import org.springframework.context.annotation.Bean;
import org.springframework.web.client.RestTemplate;

import javax.persistence.Entity;

@SpringBootApplication
@EntityScan(value = "model.subscription")
@EnableEurekaClient
@EnableCircuitBreaker
public class SubscriptionApplication {

	public static void main(String[] args) {
		SpringApplication.run(SubscriptionApplication.class, args);
	}

	@Bean
	public RestTemplate getRestTemplate(RestTemplateBuilder builder){
		return builder.build();
	}

}

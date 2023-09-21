package com.gritlab.buy01.userservice.kafka.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import com.gritlab.buy01.userservice.kafka.message.TokenValidationRequest;
import com.gritlab.buy01.userservice.kafka.message.TokenValidationResponse;
import com.gritlab.buy01.userservice.model.User;
import com.gritlab.buy01.userservice.service.AuthService;

@Service
public class KafkaConsumerService {

  @Autowired private AuthService authService;
  @Autowired private KafkaProducerService kafkaProducerService;

  @KafkaListener(topics = "token-validation-request", groupId = "user-service-group")
  public void consumeMessage(TokenValidationRequest message) {
    User userDetails = authService.getUserDetailsFromToken(message.getJwtToken());
    TokenValidationResponse response = new TokenValidationResponse();
    response.setCorrelationId(message.getCorrelationId());

    if (userDetails.equals(null)) {
      response.setErrorMessage("Error: invalid token");
    } else {
      response.setName(userDetails.getName());
      response.setRole(userDetails.getRole().toString());
      response.setUserId(userDetails.getId());
    }
    kafkaProducerService.sendMessage(response);
  }
}

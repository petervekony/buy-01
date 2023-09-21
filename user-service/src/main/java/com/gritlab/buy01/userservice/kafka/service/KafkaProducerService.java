package com.gritlab.buy01.userservice.kafka.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import com.gritlab.buy01.userservice.kafka.message.TokenValidationResponse;

@Service
public class KafkaProducerService {

  @Autowired private KafkaTemplate<String, TokenValidationResponse> kafkaTemplate;

  @Value("${kafka.topic.token-validation-response}")
  private String responseTopic;

  public void sendMessage(TokenValidationResponse message) {
    kafkaTemplate.send(responseTopic, message);
  }
}

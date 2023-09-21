package com.gritlab.buy01.productservice.kafka.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import com.gritlab.buy01.productservice.kafka.message.TokenValidationRequest;

@Service
public class KafkaProducerService {

  @Autowired private KafkaTemplate<String, TokenValidationRequest> kafkaTemplate;

  @Value("${kafka.topic.token-validation-request}")
  private String responseTopic;

  public void sendMessage(TokenValidationRequest message) {
    kafkaTemplate.send(responseTopic, message);
  }
}

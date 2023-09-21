package com.gritlab.buy01.productservice.kafka.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import com.gritlab.buy01.productservice.kafka.message.TokenValidationResponse;

@Service
public class KafkaConsumerService {

  @Autowired private KafkaProducerService kafkaProducerService;

  @KafkaListener(topics = "token-validation-response", groupId = "user-service-group")
  public void consumeMessage(TokenValidationResponse message) {

    // TODO: implement dealing with the kafka response
  }
}

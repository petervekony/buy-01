package com.gritlab.buy01.productservice.service;

import java.util.concurrent.ArrayBlockingQueue;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.TimeUnit;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import com.gritlab.buy01.productservice.kafka.message.TokenValidationRequest;
import com.gritlab.buy01.productservice.kafka.message.TokenValidationResponse;

@Service
public class KafkaService {

  private static final String TOPIC_REQUEST = "token-validation-request";
  private static final String TOPIC_RESPONSE = "token-validation-response";

  @Autowired private KafkaTemplate<String, TokenValidationRequest> kafkaTemplate;

  // Using a blocking queue to handle the response from Kafka in a synchronous manner
  private BlockingQueue<TokenValidationResponse> responseQueue = new ArrayBlockingQueue<>(1);

  public TokenValidationResponse validateTokenWithUserMicroservice(TokenValidationRequest request) {
    kafkaTemplate.send(TOPIC_REQUEST, request);

    // Wait for a response for a maximum of 10 seconds
    try {
      return responseQueue.poll(10, TimeUnit.SECONDS);
    } catch (InterruptedException e) {
      e.printStackTrace();
      return null;
    }
  }

  @KafkaListener(topics = TOPIC_RESPONSE, groupId = "product-service-group")
  public void consumeTokenValidationResponse(TokenValidationResponse response) {
    responseQueue.offer(response);
  }
}

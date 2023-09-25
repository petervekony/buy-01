package com.gritlab.buy01.productservice.service;

import java.util.concurrent.ArrayBlockingQueue;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;
import java.util.concurrent.TimeUnit;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import com.gritlab.buy01.productservice.kafka.message.TokenValidationRequest;
import com.gritlab.buy01.productservice.kafka.message.TokenValidationResponse;
import com.gritlab.buy01.productservice.kafka.message.UserProfileDeleteMessage;

@Service
public class KafkaService {

  private static final String TOPIC_REQUEST = "token-validation-request";
  private static final String TOPIC_RESPONSE = "token-validation-response";
  @Autowired private KafkaTemplate<String, TokenValidationRequest> kafkaTemplate;

  @Autowired private ProductService productService;

  private ConcurrentMap<String, BlockingQueue<TokenValidationResponse>> responseQueues =
      new ConcurrentHashMap<>();

  public TokenValidationResponse validateTokenWithUserMicroservice(TokenValidationRequest request) {
    BlockingQueue<TokenValidationResponse> queue = new ArrayBlockingQueue<>(1);
    if (request.getCorrelationId() != null) {
      responseQueues.put(request.getCorrelationId(), queue);
    } else {
      System.out.println("Error: Correlation ID is null");
      return null;
    }
    kafkaTemplate.send(TOPIC_REQUEST, request);

    // wait for a response for a maximum of 5 seconds
    try {
      TokenValidationResponse response = queue.poll(5, TimeUnit.SECONDS);
      responseQueues.remove(request.getCorrelationId());
      return response;
    } catch (InterruptedException e) {
      e.printStackTrace();
      responseQueues.remove(request.getCorrelationId());
      return null;
    }
  }

  @KafkaListener(
      topics = TOPIC_RESPONSE,
      groupId = "product-service-group",
      containerFactory = "kafkaListenerContainerFactory")
  public void consumeTokenValidationResponse(TokenValidationResponse response) {
    BlockingQueue<TokenValidationResponse> queue = responseQueues.get(response.getCorrelationId());
    if (queue != null) {
      queue.offer(response);
    }
  }

  @KafkaListener(
      topics = "user-products-deletion",
      groupId = "user-product-deletion-group",
      containerFactory = "kafkaProductDeletionContainerFactory")
  public void deleteUserProducts(UserProfileDeleteMessage request) {
    productService.deleteAllUserProducts(request.getUserId());
  }
}

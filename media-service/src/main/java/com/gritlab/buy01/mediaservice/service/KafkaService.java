package com.gritlab.buy01.mediaservice.service;

import java.util.concurrent.ArrayBlockingQueue;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;
import java.util.concurrent.TimeUnit;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import com.gritlab.buy01.mediaservice.kafka.message.ProductMediaDeleteMessage;
import com.gritlab.buy01.mediaservice.kafka.message.TokenValidationRequest;
import com.gritlab.buy01.mediaservice.kafka.message.TokenValidationResponse;
import com.gritlab.buy01.mediaservice.kafka.message.UserAvatarDeleteMessage;

@Service
public class KafkaService {

  private static final String TOPIC_REQUEST = "token-validation-request";
  private static final String TOPIC_RESPONSE = "token-validation-response";
  @Autowired private KafkaTemplate<String, TokenValidationRequest> kafkaTemplate;

  @Autowired private MediaService mediaService;

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

  @KafkaListener(topics = TOPIC_RESPONSE, groupId = "media-service-group")
  public void consumeTokenValidationResponse(TokenValidationResponse response) {
    BlockingQueue<TokenValidationResponse> queue = responseQueues.get(response.getCorrelationId());
    if (queue != null) {
      queue.offer(response);
    }
  }

  @KafkaListener(
      topics = "user-avatar-deletion",
      groupId = "user-avatar-deletion-group",
      containerFactory = "kafkaAvatarDeletionContainerFactory")
  public void deleteUserAvatar(UserAvatarDeleteMessage request) {
    mediaService.deleteAllUserAvatars(request.getUserId());
  }

  @KafkaListener(
      topics = "product-media-deletion",
      groupId = "product-media-deletion-group",
      containerFactory = "kafkaProductMediaDeletionContainerFactory")
  public void deleteProductMedia(ProductMediaDeleteMessage request) {
    mediaService.deleteAllProductMedia(request.getProductId());
  }
}

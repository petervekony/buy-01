package com.gritlab.buy01.productservice.service;

import java.util.HashSet;
import java.util.Set;
import java.util.UUID;
import java.util.concurrent.ArrayBlockingQueue;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;
import java.util.concurrent.TimeUnit;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import com.gritlab.buy01.productservice.event.ProductOwnershipValidationEvent;
import com.gritlab.buy01.productservice.event.UserProductsDeletionEvent;
import com.gritlab.buy01.productservice.kafka.message.ProductMediaDeleteMessage;
import com.gritlab.buy01.productservice.kafka.message.ProductOwnershipRequest;
import com.gritlab.buy01.productservice.kafka.message.TokenValidationRequest;
import com.gritlab.buy01.productservice.kafka.message.TokenValidationResponse;
import com.gritlab.buy01.productservice.kafka.message.UserProfileDeleteMessage;

@Service
public class KafkaService {
  private static final Logger logger = LoggerFactory.getLogger(KafkaService.class);

  private static final String TOPIC_REQUEST = "token-validation-request";
  private static final String TOPIC_RESPONSE = "token-validation-response";

  @Autowired
  @Qualifier("tokenValidationRequestKafkaTemplate")
  private KafkaTemplate<String, TokenValidationRequest> tokenValidationRequestKafkaTemplate;

  @Autowired
  @Qualifier("productMediaDeleteMessageKafkaTemplate")
  private KafkaTemplate<String, ProductMediaDeleteMessage> productMediaDeleteMessageKafkaTemplate;

  // to track processed messages and ensure idempotency
  private Set<String> processedCorrelationIds = new HashSet<>();

  @Autowired private ApplicationEventPublisher eventPublisher;

  private ConcurrentMap<String, BlockingQueue<TokenValidationResponse>> responseQueues =
      new ConcurrentHashMap<>();

  public ConcurrentMap<String, BlockingQueue<TokenValidationResponse>> getResponseQueues() {
    return responseQueues;
  }

  public TokenValidationResponse validateTokenWithUserMicroservice(TokenValidationRequest request) {
    BlockingQueue<TokenValidationResponse> queue = new ArrayBlockingQueue<>(1);
    if (request.getCorrelationId() != null) {
      responseQueues.put(request.getCorrelationId(), queue);
    } else {
      System.out.println("Error: Correlation ID is null");
      return null;
    }
    tokenValidationRequestKafkaTemplate.send(TOPIC_REQUEST, request);

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
    eventPublisher.publishEvent(new UserProductsDeletionEvent(this, request.getUserId()));
  }

  public void deleteProductMedia(String productId) {
    String correlationId = UUID.randomUUID().toString();

    if (processedCorrelationIds.contains(correlationId)) {
      logger.warn("Duplicate deletion request detected for product: {}", productId);
      return;
    }

    ProductMediaDeleteMessage message = new ProductMediaDeleteMessage(correlationId, productId);

    productMediaDeleteMessageKafkaTemplate.send("product-media-deletion", message);

    processedCorrelationIds.add(correlationId);
  }

  @KafkaListener(
      topics = "product-ownership-requests",
      groupId = "product-ownership-request-group",
      containerFactory = "kafkaProductOwnershipRequestListenerContainerFactory")
  public void validateOwnership(ProductOwnershipRequest request) {
    eventPublisher.publishEvent(
        new ProductOwnershipValidationEvent(
            this, request.getProductId(), request.getUserId(), request.getCorrelationId()));
  }
}

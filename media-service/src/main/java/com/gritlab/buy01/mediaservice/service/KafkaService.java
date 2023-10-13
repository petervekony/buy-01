package com.gritlab.buy01.mediaservice.service;

import java.util.concurrent.ArrayBlockingQueue;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;
import java.util.concurrent.TimeUnit;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import com.gritlab.buy01.mediaservice.kafka.message.ProductMediaDeleteMessage;
import com.gritlab.buy01.mediaservice.kafka.message.ProductOwnershipRequest;
import com.gritlab.buy01.mediaservice.kafka.message.ProductOwnershipResponse;
import com.gritlab.buy01.mediaservice.kafka.message.TokenValidationRequest;
import com.gritlab.buy01.mediaservice.kafka.message.TokenValidationResponse;
import com.gritlab.buy01.mediaservice.kafka.message.UserAvatarDeleteMessage;
import com.gritlab.buy01.mediaservice.kafka.message.UserAvatarUpdateRequest;
import com.gritlab.buy01.mediaservice.kafka.message.UserAvatarUpdateResponse;

@Service
public class KafkaService {

  private static final String TOPIC_REQUEST = "token-validation-request";
  private static final String TOPIC_RESPONSE = "token-validation-response";

  @Autowired
  @Qualifier("kafkaTemplate")
  private KafkaTemplate<String, TokenValidationRequest> kafkaTemplate;

  @Autowired
  @Qualifier("productOwnershipRequestKafkaTemplate")
  private KafkaTemplate<String, ProductOwnershipRequest> productOwnerShipKafkaTemplate;

  @Autowired
  @Qualifier("userAvatarUpdateRequestKafkaTemplate")
  private KafkaTemplate<String, UserAvatarUpdateRequest> userAvatarUpdateRequestKafkaTemplate;

  @Autowired private MediaService mediaService;

  private ConcurrentMap<String, BlockingQueue<TokenValidationResponse>> responseQueues =
      new ConcurrentHashMap<>();

  private ConcurrentMap<String, BlockingQueue<ProductOwnershipResponse>>
      productOwnershipResponseQueues = new ConcurrentHashMap<>();

  private ConcurrentMap<String, BlockingQueue<UserAvatarUpdateResponse>>
      userAvatarUpdateResponseQueues = new ConcurrentHashMap<>();

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
    mediaService.requestDeleteAllUserAvatars(request.getUserId());
  }

  @KafkaListener(
      topics = "product-media-deletion",
      groupId = "product-media-deletion-group",
      containerFactory = "kafkaProductMediaDeletionContainerFactory")
  public void deleteProductMedia(ProductMediaDeleteMessage request) {
    mediaService.requestDeleteAllProductMedia(request.getProductId());
  }

  public void sendProductOwnershipRequest(String productId, String userId) {
    ProductOwnershipRequest request = new ProductOwnershipRequest(productId, userId);
    productOwnerShipKafkaTemplate.send("product-ownership-requests", request);
  }

  @KafkaListener(
      topics = "product-ownership-responses",
      groupId = "media-service-group",
      containerFactory = "kafkaProductOwnershipResponseListenerContainerFactory")
  public void handleProductOwnershipResponse(ProductOwnershipResponse response) {
    // Retrieve the queue using correlation ID from the response
    BlockingQueue<ProductOwnershipResponse> queue =
        productOwnershipResponseQueues.get(response.getCorrelationId());

    if (queue != null) {
      queue.offer(response); // Place the response into the queue
    }
  }

  public ProductOwnershipResponse sendProductOwnershipRequestAndWaitForResponse(
      ProductOwnershipRequest request) {
    BlockingQueue<ProductOwnershipResponse> responseQueue = new ArrayBlockingQueue<>(1);

    String correlationId = request.getCorrelationId();

    productOwnershipResponseQueues.put(correlationId, responseQueue);

    productOwnerShipKafkaTemplate.send("product-ownership-requests", request);

    try {
      ProductOwnershipResponse response = responseQueue.poll(5, TimeUnit.SECONDS);
      return response;
    } catch (InterruptedException e) {
      e.printStackTrace();
      return null;
    } finally {
      productOwnershipResponseQueues.remove(correlationId);
    }
  }

  public UserAvatarUpdateResponse sendUserAvatarUpdateRequestAndWaitForResponse(
      UserAvatarUpdateRequest request) {
    BlockingQueue<UserAvatarUpdateResponse> responseQueue = new ArrayBlockingQueue<>(1);

    String correlationId = request.getCorrelationId();

    userAvatarUpdateResponseQueues.put(correlationId, responseQueue);

    userAvatarUpdateRequestKafkaTemplate.send("user-avatar-update-requests", request);

    try {
      UserAvatarUpdateResponse response = responseQueue.poll(5, TimeUnit.SECONDS);
      return response;
    } catch (InterruptedException e) {
      return null;
    } finally {
      userAvatarUpdateResponseQueues.remove(correlationId);
    }
  }

  @KafkaListener(
      topics = "user-avatar-update-responses",
      groupId = "media-service-group",
      containerFactory = "kafkaUserAvatarUpdateResponseListenerContainerFactory")
  public void handleUserAvatarUpdateResponse(UserAvatarUpdateResponse response) {
    BlockingQueue<UserAvatarUpdateResponse> queue =
        userAvatarUpdateResponseQueues.get(response.getCorrelationId());

    if (queue != null) {
      queue.offer(response); // Place the response into the queue
    }
  }
}

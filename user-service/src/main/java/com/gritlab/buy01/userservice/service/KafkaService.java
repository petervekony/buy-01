package com.gritlab.buy01.userservice.service;

import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import com.gritlab.buy01.userservice.kafka.message.TokenValidationRequest;
import com.gritlab.buy01.userservice.kafka.message.TokenValidationResponse;
import com.gritlab.buy01.userservice.kafka.message.UserProfileDeleteMessage;
import com.gritlab.buy01.userservice.model.User;

@Service
public class KafkaService {

  private static final Logger logger = LoggerFactory.getLogger(KafkaService.class);

  @Autowired private AuthService authService;

  @Autowired
  @Qualifier("tokenValidationResponseKafkaTemplate")
  private KafkaTemplate<String, TokenValidationResponse> tokenValidationResponseKafkaTemplate;

  @Autowired
  @Qualifier("userProfileDeleteMessageKafkaTemplate")
  private KafkaTemplate<String, UserProfileDeleteMessage> userProfileDeleteMessageKafkaTemplate;

  @Value("${kafka.topic.token-validation-response}")
  private String responseTopic;

  // To track processed messages and ensure idempotency
  private Set<String> processedCorrelationIds = new HashSet<>();

  public void sendMessage(TokenValidationResponse message) {
    tokenValidationResponseKafkaTemplate.send(responseTopic, message);
  }

  @KafkaListener(topics = "token-validation-request", groupId = "user-service-group")
  public void consumeMessage(TokenValidationRequest message) {
    try {
      // Check if this message was already processed
      if (processedCorrelationIds.contains(message.getCorrelationId())) {
        logger.warn(
            "Duplicate message detected with correlationId: {}", message.getCorrelationId());
        return;
      }

      User userDetails = authService.getUserDetailsFromToken(message.getJwtToken());
      TokenValidationResponse response = new TokenValidationResponse();
      response.setCorrelationId(message.getCorrelationId());

      if (userDetails == null) {
        response.setErrorMessage("Error: invalid token");
      } else {
        response.setName(userDetails.getName());
        response.setEmail(userDetails.getEmail());
        response.setRole(userDetails.getRole().toString());
        response.setUserId(userDetails.getId());
      }

      // Send the response
      sendMessage(response);

      // Mark this message as processed
      processedCorrelationIds.add(message.getCorrelationId());

    } catch (Exception e) {
      logger.error(
          "Error processing message with correlationId: {}", message.getCorrelationId(), e);
    }
  }

  public void deleteUserItems(User user) {
    String correlationId = UUID.randomUUID().toString();

    if (processedCorrelationIds.contains(correlationId)) {
      logger.warn("Duplicate deletion request detected for user: {}", user.getId());
      return;
    }

    UserProfileDeleteMessage message = new UserProfileDeleteMessage(correlationId, user.getId());
    if (user.getAvatar() != null) {
      // TODO: implement media message to delete avatar
    }

    userProfileDeleteMessageKafkaTemplate.send("user-products-deletion", message);

    processedCorrelationIds.add(correlationId);
  }
}

package com.gritlab.buy01.productservice.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;

import java.time.Instant;
import java.util.concurrent.ArrayBlockingQueue;
import java.util.concurrent.BlockingQueue;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.kafka.core.KafkaTemplate;

import com.gritlab.buy01.productservice.cache.CachedTokenInfo;
import com.gritlab.buy01.productservice.event.ProductOwnershipValidationEvent;
import com.gritlab.buy01.productservice.event.UserProductsDeletionEvent;
import com.gritlab.buy01.productservice.kafka.message.ProductMediaDeleteMessage;
import com.gritlab.buy01.productservice.kafka.message.ProductOwnershipRequest;
import com.gritlab.buy01.productservice.kafka.message.TokenValidationRequest;
import com.gritlab.buy01.productservice.kafka.message.TokenValidationResponse;
import com.gritlab.buy01.productservice.kafka.message.UserProfileDeleteMessage;

public class KafkaServiceTests {

  @Mock private KafkaTemplate<String, TokenValidationRequest> tokenValidationRequestKafkaTemplate;

  @Mock
  private KafkaTemplate<String, ProductMediaDeleteMessage> productMediaDeleteMessageKafkaTemplate;

  @Mock private ApplicationEventPublisher eventPublisher;

  @InjectMocks private KafkaService kafkaService;

  @BeforeEach
  public void setUp() {
    MockitoAnnotations.openMocks(this);
  }

  @Test
  public void testValidateTokenWithUserMicroservice() {
    // Creating a new request with a unique token and correlation ID
    TokenValidationRequest request = new TokenValidationRequest();
    request.setJwtToken("uniqueToken");
    request.setCorrelationId("uniqueCorrelationId");

    // Ensuring the cache does not contain an entry for this token
    kafkaService.getTokenCache().remove(request.getJwtToken());

    // Call the method under test
    kafkaService.validateTokenWithUserMicroservice(request);

    // Verify that the Kafka template was used to send the request
    verify(tokenValidationRequestKafkaTemplate).send(eq("token-validation-request"), eq(request));
  }

  @Test
  public void testConsumeTokenValidationResponse() {
    TokenValidationResponse response = new TokenValidationResponse();
    response.setUserId("123");
    response.setName("testUser");
    response.setRole("CLIENT");
    response.setCorrelationId("123-correlation");

    BlockingQueue<TokenValidationResponse> queueResponse = new ArrayBlockingQueue<>(1);
    kafkaService.getResponseQueues().put(response.getCorrelationId(), queueResponse);

    kafkaService.consumeTokenValidationResponse(response);

    assertEquals(response, queueResponse.poll());
  }

  @Test
  public void testValidateTokenWithUserMicroserviceCacheHit() {
    TokenValidationRequest request = new TokenValidationRequest();
    request.setCorrelationId("123");
    request.setJwtToken("cachedToken");

    // Simulating a cached token
    TokenValidationResponse cachedResponse = new TokenValidationResponse();
    cachedResponse.setJwtToken("cachedToken");
    CachedTokenInfo cachedTokenInfo = new CachedTokenInfo(cachedResponse, Instant.now());
    kafkaService.getTokenCache().put("cachedToken", cachedTokenInfo);

    TokenValidationResponse response = kafkaService.validateTokenWithUserMicroservice(request);

    // Verify that KafkaTemplate was not called
    verify(tokenValidationRequestKafkaTemplate, never()).send(anyString(), any());
    // Verify the response is from the cache
    assertEquals("cachedToken", response.getJwtToken());
  }

  @Test
  public void testDeleteUserProducts() {
    UserProfileDeleteMessage message = new UserProfileDeleteMessage();
    message.setUserId("123");

    kafkaService.deleteUserProducts(message);

    verify(eventPublisher).publishEvent(any(UserProductsDeletionEvent.class));
  }

  @Test
  public void testDeleteProductMedia() {
    // Create a productId for testing
    String productId = "123";

    kafkaService.deleteProductMedia(productId);

    // Verify that productMediaDeleteMessageKafkaTemplate.send is called with any
    // ProductMediaDeleteMessage
    verify(productMediaDeleteMessageKafkaTemplate)
        .send(eq("product-media-deletion"), any(ProductMediaDeleteMessage.class));
  }

  @Test
  public void testValidateOwnership() {
    ProductOwnershipRequest request = new ProductOwnershipRequest();
    request.setProductId("123");
    request.setUserId("456");

    kafkaService.validateOwnership(request);

    verify(eventPublisher).publishEvent(any(ProductOwnershipValidationEvent.class));
  }
}

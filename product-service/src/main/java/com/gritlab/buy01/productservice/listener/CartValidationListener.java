package com.gritlab.buy01.productservice.listener;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

import com.gritlab.buy01.productservice.event.CartValidationEvent;
import com.gritlab.buy01.productservice.kafka.message.CartValidationResponse;
import com.gritlab.buy01.productservice.service.ProductService;

@Component
public class CartValidationListener {
  private final ProductService productService;

  @Autowired
  public CartValidationListener(
      ProductService productService, KafkaTemplate<String, CartValidationResponse> kafkaTemplate) {
    this.productService = productService;
  }

  @EventListener
  public void handleCartValidationEvent(CartValidationEvent event) {
    productService.enqueueEvent(event);
  }
}

package com.gritlab.buy01.orderservice.kafka.message;

import com.gritlab.buy01.orderservice.dto.Cart;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class CartValidationRequest {
  String correlationId;
  Cart cart;
}

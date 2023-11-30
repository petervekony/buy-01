package com.gritlab.buy01.productservice.kafka.message;

import com.gritlab.buy01.productservice.dto.Cart;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class CartValidationRequest {
  String correlationId;
  Cart cart;
}

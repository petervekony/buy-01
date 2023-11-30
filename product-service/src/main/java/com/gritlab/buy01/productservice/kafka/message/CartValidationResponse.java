package com.gritlab.buy01.productservice.kafka.message;

import com.gritlab.buy01.productservice.dto.Cart;
import com.gritlab.buy01.productservice.dto.OrderModifications;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class CartValidationResponse {
  private String correlationId;

  private Boolean processed;

  private Cart cart;

  // this contains all the modifications for the unprocessed orders
  private OrderModifications orderModifications;
}
